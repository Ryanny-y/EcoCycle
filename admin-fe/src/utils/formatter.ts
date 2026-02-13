export const formatName = (
  lastName: string,
  firstName: string,
  middleName: string | null
): string => {
  const toProperCase = (value: string): string =>
    value
      .toLowerCase()
      .split(" ")
      .map(
        part => part.charAt(0).toUpperCase() + part.slice(1)
      )
      .join(" ");

  const formattedLast = toProperCase(lastName.trim());
  const formattedFirst = toProperCase(firstName.trim());

  if (middleName && middleName.trim().length > 0) {
    const middleInitial =
      middleName.trim().charAt(0).toUpperCase();
    return `${formattedLast}, ${formattedFirst} ${middleInitial}.`;
  }

  return `${formattedLast}, ${formattedFirst}`;
};