const ESCAPED_PIPE_REGEX = /\\\|/g;

export function stripPipeEscapes(input: string): string {
    return input.replaceAll(ESCAPED_PIPE_REGEX, "|");
}
