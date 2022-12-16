export default {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      retry: 0,
      staleTime: 1000 * 30, // 30 seconds
    }
  }
}
