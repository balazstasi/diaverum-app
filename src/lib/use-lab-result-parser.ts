import { Schema, Data } from "effect";
import { Effect, pipe } from "effect";
import { useCallback, useState } from "react";

const LabResultSchema = Schema.Struct({
  clinicNo: Schema.String,
  barcode: Schema.String,
  patientId: Schema.String,
  patientName: Schema.String,
  dateOfBirth: Schema.String,
  gender: Schema.Union(Schema.Literal("M"), Schema.Literal("F")),
  collectionDate: Schema.String,
  collectionTime: Schema.String,
  testCode: Schema.String,
  testName: Schema.String,
  result: Schema.String,
  unit: Schema.optional(Schema.String),
  refRangeLow: Schema.optional(Schema.String),
  refRangeHigh: Schema.optional(Schema.String),
  note: Schema.optional(Schema.String),
  nonSpecRefs: Schema.optional(Schema.String),
});

type LabResult = Schema.Schema.Type<typeof LabResultSchema>;

class ParsingError extends Data.TaggedError("ParsingError")<{ message: string; line?: number }> {}
class InvalidHeaderError extends Data.TaggedError("InvalidHeaderError")<{ message: string }> {}
class NotEnoughLinesError extends Data.TaggedError("NotEnoughLinesError")<{ message: string }> {}

function parseLabResults(input: string) {
  return Effect.gen(function* (_) {
    const lines = input.split("\n").filter((line) => line && !line.startsWith("#"));
    const headers = lines[0].split("|").map((header) => header.toLowerCase().replace(/[^a-z0-9]/g, ""));

    if (headers.length !== lines[0].split("|").length) {
      return yield* _(Effect.fail(new InvalidHeaderError({ message: "Headers and data do not match" })));
    }

    if (lines.length < 2) {
      return yield* _(Effect.fail(new NotEnoughLinesError({ message: "Not enough lines to parse" })));
    }

    return yield* _(
      Effect.forEach(lines.slice(1), (line, index) =>
        pipe(
          line.split("|"),
          (values) =>
            headers.reduce(
              (obj, header, idx) => ({ ...obj, [header]: values[idx] }),
              {} as Record<string, string>
            ),
          (result) => ({
            clinicNo: result.clinicno,
            barcode: result.barcode,
            patientId: result.patientid,
            patientName: result.patientname,
            dateOfBirth: result.dob,
            gender: result.gender as LabResult["gender"],
            collectionDate: result.collectiondate,
            collectionTime: result.collectiontime,
            testCode: result.testcode,
            testName: result.testname,
            result: result.result,
            unit: result.unit,
            refRangeLow: result.refrangelow,
            refRangeHigh: result.refrangehigh,
            note: result.note,
            nonSpecRefs: result.nonspecrefs,
          }),
          (toDecode) => Schema.decode(LabResultSchema)(toDecode as LabResult),
          Effect.mapError((error) => new ParsingError({ message: error.message, line: index + 2 })),
          Effect.catchTags({
            ParsingError: (error) => Effect.succeed({ ...error, line: index + 2 }),
          })
        )
      )
    );
  });
}

const useLabResultParser = () => {
  const [results, setResults] = useState<LabResult[]>([]);

  const processLabResults = useCallback(
    (fileContent: string) =>
      pipe(
        parseLabResults(fileContent),
        Effect.catchTags({
          InvalidHeaderError: (error) => Effect.fail(error.message),
          NotEnoughLinesError: (error) => Effect.fail(error.message),
        }),
        Effect.tap((results) => {
          console.log("setting results");
          setResults(results as LabResult[]);
        })
      ),
    []
  );

  return { results, processLabResults };
};

export { useLabResultParser };
