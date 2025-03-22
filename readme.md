# web-llm-ui

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/adamelliotfields/web-llm-ui?devcontainer_path=.devcontainer/devcontainer.json&machine=basicLinux32gb)

https://github.com/adamelliotfields/web-llm-ui/assets/7433025/07565763-606b-4de3-aa2d-8d5a26c83941

A React app I made to experiment with [quantized](https://huggingface.co/docs/transformers/en/quantization/overview) models in the browser using [WebGPU](https://webgpu.org). The models are compiled to WebAssembly using [MLC](https://github.com/mlc-ai/mlc-llm), which is like [llama.cpp](https://github.com/ggml-org/llama.cpp) for the web.

I'm not going to update this, but the official app at [chat.webllm.ai](https://chat.webllm.ai) is actively maintained. Use that or one of [xenova](https://huggingface.co/Xenova)'s WebGPU [spaces](https://huggingface.co/collections/Xenova/transformersjs-demos-64f9c4f49c099d93dbc611df) instead.

## Usage

```sh
bun install
bun start
```

## Known issues

Using `q4f32` quantized models, as `q4f16` requires a flag. See [webgpureport.org](https://webgpureport.org).

### Cannot find global function

If you see this message, it is a cache issue. You can delete an individual cache with:

```js
await caches.delete('webllm/wasm')
```

Or all caches:

```js
await caches.keys().then(keys => Promise.all(keys.map(key => caches.delete(key))))
```

## Reference

There is only 1 class you need to know to get started: [`ChatModule`](https://github.com/mlc-ai/web-llm/blob/main/src/chat_module.ts)

```ts
const chat = new ChatModule()

// callback that fires on progress updates during initialization (e.g., fetching chunks)
type ProgressReport = { progress: number; text: string; timeElapsed: number }
type Callback = (report: ProgressReport) => void
const onProgress: Callback = ({ text }) => console.log(text)
chat.setInitProgressCallback(onProgress)

// load/reload with new model
// customize `temperature`, `repetition_penalty`, `top_p`, etc. in `options`
// set system message in `options.conv_config.system`
// defaults are in conversation.ts and the model's mlc-chat-config.json
import type { ChatOptions } from '@mlc-ai/web-llm'
import config from './src/config'
const id = 'TinyLlama-1.1B-Chat-v0.4-q4f32_1-1k'
const options: ChatOptions = { temperature: 0.9, conv_config: { system: 'You are a helpful assistant.' } }
await chat.reload(id, options, config)

// generate response from prompt
// callback fired on each generation step
// returns the complete response string when resolved
type Callback = (step: number, message: string) => void
const onGenerate: Callback = (_, message) => console.log(message)
const response = await chat.generate('What would you like to talk about?', onGenerate)

// get last response (sync)
const message: string = chat.getMessage()

// interrupt generation if in progress (sync)
// resolves the Promise returned by `generate`
chat.interruptGenerate()

// check if generation has stopped (sync)
// shorthand for `chat.getPipeline().stopped()`
const isStopped: boolean = chat.stopped()

// reset chat, optionally keep stats (defaults to false)
const keepStats = true
await chat.resetChat(keepStats)

// get stats
// shorthand for `await chat.getPipeline().getRuntimeStatsText()`
const statsText: string = await chat.runtimeStatsText()

// unload model from memory
await chat.unload()

// get GPU vendor
const vendor: string = await chat.getGPUVendor()

// get max storage buffer binding size
// used to determine the `low_resource_required` flag
const bufferBindingSize: number = await chat.getMaxStorageBufferBindingSize()

// getPipeline is private (useful for debugging in dev tools)
const pipeline = chat.getPipeline()
```

## Cache management

The library uses the browser's [`CacheStorage`](https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage) API to store models and their configs.

There is an exported helper function to check if a model is in the cache.

```ts
import { hasModelInCache } from '@mlc-ai/web-llm'
import config from './config'
const inCache = hasModelInCache('Phi2-q4f32_1', config) // throws if model ID is not in the config
```

## VRAM requirements

See [utils/vram_requirements](https://github.com/mlc-ai/web-llm/tree/main/utils/vram_requirements) in the Web LLM repo.
