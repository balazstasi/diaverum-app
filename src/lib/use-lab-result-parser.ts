import { Data, Either, Schema } from "effect";
import { Effect, pipe } from "effect";
import { useCallback, useState } from "react";

const LabResultSchema = Schema.Struct({
  clinicNo: Schema.String,
  barcode: Schema.String,
  collectionDate: Schema.String,
  collectionTime: Schema.String,
  testCode: Schema.String,
  testName: Schema.String,
  unit: Schema.String,
  refRangeLow: Schema.optional(Schema.String),
  refRangeHigh: Schema.optional(Schema.String),
  result: Schema.String,
  note: Schema.optional(Schema.String),
  nonSpecRefs: Schema.optional(Schema.String),
  patientInfo: Schema.Struct({
    id: Schema.String,
    name: Schema.String,
    dob: Schema.String,
    gender: Schema.Union(Schema.Literal("M"), Schema.Literal("F")),
  }),
});

interface LabTest {
  clinicNo: string;
  barcode: string;
  testCode: string;
  testName: string;
  result: number | string;
  unit?: string;
  refRangeLow?: number;
  refRangeHigh?: number;
  note?: string;
  nonSpecRefs?: string;
  collectionDate: string;
  collectionTime: string;
  patientInfo: {
    id: string;
    name: string;
    dob: string;
    gender: "M" | "F";
  };
}

class InvalidHeaderError extends Data.TaggedError("InvalidHeaderError")<{ message: string }> {}
class NotEnoughLinesError extends Data.TaggedError("NotEnoughLinesError")<{ message: string }> {}
class ValidationError extends Data.TaggedError("ValidationError")<{ message: string; line?: number }> {}
class EmptyFileError extends Data.TaggedError("EmptyFileError")<{ message: string }> {}

function parseLabResults(input: string) {
  return Effect.gen(function* (_) {
    if (input.trim() === "") {
      return yield* _(Effect.fail(new EmptyFileError({ message: "File is empty" })));
    }

    const lines = input.split("\n").filter((line) => line && !line.startsWith("#"));
    const headers = lines[0].split("|").map((header) => header.toLowerCase().replace(/[^a-z0-9]/g, ""));
    console.log("🚀 ~ parseLabResults ~ headers:", headers);

    if (headers.length !== lines[0].split("|").length) {
      return yield* _(Effect.fail(new InvalidHeaderError({ message: "Headers and data do not match" })));
    }
    if (lines.length < 2) {
      return yield* _(Effect.fail(new NotEnoughLinesError({ message: "Not enough lines to parse" })));
    }

    return yield* _(
      Effect.forEach(lines.slice(1), (line, index) =>
        pipe(
          Effect.try({
            try: () => {
              const values = line.split("|");
              const rawData = headers.reduce(
                (obj, header, idx) => ({ ...obj, [header]: values[idx] }),
                {} as Record<string, string>
              );
              return rawData;
            },
            catch: (error) => new ValidationError({ message: String(error), line: index + 2 }),
          }),
          Effect.map((result) => {
            return {
              clinicNo: result.clinicno,
              barcode: result.barcode,
              testCode: result.testcode,
              testName: result.testname,
              result: result.result,
              unit: result.unit,
              refRangeLow: result.refrangelow,
              refRangeHigh: result.refrangehigh,
              note: result.note,
              nonSpecRefs: result.nonspecrefs,
              collectionDate: result.collectiondate,
              collectionTime: result.collectiontime,
              patientInfo: {
                id: result.patientid,
                name: result.patientname,
                dob: result.dob,
                gender: result.gender,
              },
            };
          }),
          Effect.map((result) => {
            const validated = Schema.validateEither(LabResultSchema);
            const validatedResult = validated(result);
            console.log("🚀 ~ parseLabResults ~ validatedResult:", validatedResult);
            if (Either.isLeft(validatedResult)) {
              return;
            }
            return validatedResult.right;
          }),
          Effect.map((result) => result as unknown as LabTest)
        )
      )
    );
  });
}

export const useLabResultParser = () => {
  const [results, setResults] = useState<LabTest[]>([]);
  console.log("🚀 ~ useLabResultParser ~ results:", results);
  const [error, setError] = useState<string | null>(null);

  const processLabResults = useCallback(
    (fileContent: string) =>
      pipe(
        parseLabResults(fileContent),
        Effect.flatMap((results) => {
          return Effect.succeed(results as LabTest[]);
        }),
        Effect.tap((results) => setResults(results as LabTest[])),
        Effect.catchTags({
          InvalidHeaderError: (error) => Effect.fail(error.message),
          NotEnoughLinesError: (error) => Effect.fail(error.message),
          ValidationError: (error) => Effect.fail(error.message),
          EmptyFileError: (error) => Effect.fail(error.message),
        }),
        Effect.match({
          onSuccess: (results) => {
            setResults(results as LabTest[]);
            setError(null);
          },
          onFailure: (error) => {
            setError(error);
            setResults([]);
          },
        }),
        Effect.runPromise
      ),
    []
  );

  return { results, error, processLabResults };
};
