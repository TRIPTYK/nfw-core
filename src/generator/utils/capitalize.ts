export function capitalize(input: string) {
    input = input.toLowerCase();
    return input.charAt(0).toUpperCase() + input.slice(1);
}