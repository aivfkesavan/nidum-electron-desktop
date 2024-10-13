import { useCallback } from "react";
import { useExternalState } from "./useExternalState";
import { electronLlmRpc } from "../rpc/llmRpc";
import { llmState } from "../state/llmState";
import type { ChatHistoryItem } from "node-llama-cpp";
import { getModelPath } from "../actions/llms";

function useNodeOllama() {
  const state = useExternalState(llmState);
  const { generatingResult } = state.chatSession;

  const openSelectModelFileDialog = useCallback(async () => {
    try {
      await electronLlmRpc.selectModelFileAndLoad();
    } catch (error) {
      console.log(error)
    }
  }, []);

  const loadModel = useCallback(async (path: string) => {
    try {
      const { modelPath } = await getModelPath(path)
      await electronLlmRpc.loadModel(modelPath)
    } catch (error) {
      console.log(error)
    }
  }, [])

  const stopActivePrompt = useCallback(() => {
    void electronLlmRpc.stopActivePrompt();
  }, []);

  const resetChatHistory = useCallback(() => {
    void electronLlmRpc.stopActivePrompt();
    void electronLlmRpc.resetChatHistory();
  }, []);

  const sendPrompt = useCallback((prompt: string) => {
    if (generatingResult) return;

    void electronLlmRpc.prompt(prompt);
  }, [generatingResult]);

  const onPromptInput = useCallback((currentText: string) => {
    void electronLlmRpc.setDraftPrompt(currentText);
  }, []);

  const getChatHistory = useCallback(() => {
    return electronLlmRpc.getChatHistory()
  }, []);

  const setChatHistory = useCallback((items: ChatHistoryItem[]) => {
    return electronLlmRpc.setChatHistory(items)
  }, []);

  const error = state.llama.error ?? state.model.error ?? state.context.error ?? state.contextSequence.error;
  const loading = state.selectedModelFilePath != null && error == null && (
    !state.model.loaded || !state.llama.loaded || !state.context.loaded || !state.contextSequence.loaded || !state.chatSession.loaded
  );
  const allLoaded = state.model.loaded && state.llama.loaded && state.context.loaded && state.contextSequence.loaded && state.chatSession.loaded
  const showMessage = state.selectedModelFilePath == null || error != null || state.chatSession.simplifiedChat.length === 0;

  return {
    state,
    error,
    loading,
    allLoaded,
    showMessage,
    generatingResult,
    loadModel,
    openSelectModelFileDialog,
    stopActivePrompt,
    resetChatHistory,
    sendPrompt,
    onPromptInput,
    getChatHistory,
    setChatHistory,
  }
}

export default useNodeOllama
