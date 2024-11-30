export default function getGreeting(): string {
  const currentHour = new Date().getHours();

  if (currentHour >= 5 && currentHour < 11) {
    return "おはようございます";
  } else if (currentHour >= 11 && currentHour < 17) {
    return "こんにちは";
  } else {
    return "こんばんは";
  }
}
