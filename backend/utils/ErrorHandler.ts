export default function ErrorHandler(e: Error) {
  console.error(e);
  return { message: e.message };
}
