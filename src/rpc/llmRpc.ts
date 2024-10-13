import { ElectronFunctions } from "../../electron/rpc/llmRpc";
import { createRendererSideBirpc } from "../utils/createRendererSideBirpc";
import { llmState } from "../state/llmState";
import { LlmState } from "../../electron/state/llmState";


const renderedFunctions = {
    updateState(state: LlmState) {
        llmState.state = state;
    }
} as const;
export type RenderedFunctions = typeof renderedFunctions;

export const electronLlmRpc = createRendererSideBirpc<ElectronFunctions, RenderedFunctions>("llmRpc", "llmRpc", renderedFunctions);

electronLlmRpc.getState()
    .then((state) => {
        llmState.state = state;
    })
    .catch((error) => {
        console.error("Failed to get the initial state from the main process", error);
    });
