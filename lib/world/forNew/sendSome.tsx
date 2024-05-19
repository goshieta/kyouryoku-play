//生のデータが送られてきて、もし不正なデータだった場合エラーを返す
export default async function sendMessage(
  data: {
    title?: string;
    tags: string[];
    body: string;
  },
  setIsSending: (newVal: boolean) => void
): Promise<{ code: string; body: string }[] | true> {
  return [];
}
