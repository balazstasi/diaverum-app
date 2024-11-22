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

function parseLabResults(input: string) {
  return Effect.gen(function* (_) {
    const lines = input.split("\n").filter((line) => line && !line.startsWith("#"));
    const headers = lines[0].split("|").map((header) => header.toLowerCase().replace(/[^a-z0-9]/g, ""));
    const results = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const values = line.split("|");
      const result = headers.reduce(
        (obj, header, index) => ({ ...obj, [header]: values[index] }),
        {} as Record<string, string>
      );
      const toDecode = {
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
      };
      const decoded = yield* _(Schema.decode(LabResultSchema)(toDecode as LabResult)).pipe(
        Effect.mapError((error) => new ParsingError({ message: error.message, line: i + 1 })),
        Effect.catchTags({
          ParsingError: (error) => Effect.succeed({ ...error, line: i + 1 }),
        })
      );
      results.push(decoded);
    }

    return results;
  });
}

const useLabResultParser = () => {
  const [results, setResults] = useState<LabResult[]>([]);

  const processLabResults = useCallback(
    (fileContent: string) =>
      pipe(
        parseLabResults(fileContent),
        Effect.catchAll((error) =>
          Effect.fail(
            `Failed to parse lab results: ${
              error._tag === "ParsingError" ? `Line ${error.line}: ${error.message}` : error
            }`
          )
        ),
        Effect.tap((results) => {
          console.log("setting results");
          setResults(results);
        })
      ),
    []
  );

  return { results, processLabResults };
};

export { useLabResultParser };
