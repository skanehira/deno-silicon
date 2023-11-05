import { io } from "./deps_deprecated.ts";
import { generate, Options } from "./silicon.ts";

/** @deprecated Use `Partial<Options>` instead. */
export type Option = Partial<Options>;

/*
 * Generates image from source code.
 *
 * @deprecated Use `generate` instead.
 */
export async function generateImage(
  code: string,
  language: string,
  opts?: Option,
): Promise<Deno.Reader> {
  const data = generate(code, language, opts);
  const buffer = new io.Buffer();
  await buffer.write(data);
  return buffer;
}
