export function getCityFromTzName(timezone: string) {
  if (timezone.includes("/")) {
    const arr = timezone.split("/");
    if (arr.length === 3) {
      return fromUnderscoreToPascal(arr[2]);
    }
    return fromUnderscoreToPascal(arr[1]);
  }
  return timezone;
}

export function fromUnderscoreToPascal(input: string) {
  return input.split("_").join(" ");
}
