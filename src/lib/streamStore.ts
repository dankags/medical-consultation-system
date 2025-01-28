type StreamData = {
    writable: WritableStream;
    readable: ReadableStream;
  };
  
  class StreamStore {
    private static instance: StreamStore;
    private streams: Map<string, StreamData>;
  
    private constructor() {
      this.streams = new Map<string, StreamData>();
    }
  
    static getInstance(): StreamStore {
      if (!StreamStore.instance) {
        StreamStore.instance = new StreamStore();
      }
      return StreamStore.instance;
    }
  
    addStream(userId: string, streamData: StreamData): void {
      this.streams.set(userId, streamData);
    }
  
    getStream(userId: string): StreamData | undefined {
      return this.streams.get(userId);
    }
  
    removeStream(userId: string): void {
      this.streams.delete(userId);
    }
  
    getAllStreams(): Map<string, StreamData> {
      return this.streams;
    }
  }
  
  export default StreamStore.getInstance();
  