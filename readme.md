# chat

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/adamelliotfields/chat?devcontainer_path=.devcontainer/devcontainer.json&machine=basicLinux32gb) [![Open in Codeanywhere](https://codeanywhere.com/img/open-in-codeanywhere-btn.svg)](https://app.codeanywhere.com/#https://github.com/adamelliotfields/chat/)

> [!IMPORTANT]  
> No longer maintained. :cry: When I first made this, there was no UI for WebLLM. The official app at [chat.webllm.ai](https://chat.webllm.ai) is now the best UI for WebLLM and is actively maintained. Use that or one of Xenova's WebGPU [spaces](https://huggingface.co/collections/Xenova/transformersjs-demos-64f9c4f49c099d93dbc611df) instead! :llama:

React chat UI for [Web LLM](https://webllm.mlc.ai) on GitHub Pages. Built with Tailwind and Jotai. Inspired by [Perplexity Labs](https://labs.perplexity.ai).

https://github.com/adamelliotfields/chat/assets/7433025/07565763-606b-4de3-aa2d-8d5a26c83941

## Introduction

[Web LLM](https://github.com/mlc-ai/web-llm) is a project under the [MLC](https://mlc.ai) (machine learning compilation) organization. It allows you to run large language models in the browser using WebGPU and WebAssembly. Check out the [example](https://github.com/mlc-ai/web-llm/tree/main/examples/simple-chat) and read the [introduction](https://mlc.ai/chapter_introduction/index.html) to learn more.

In addition to [`@mlc-ai/web-llm`](https://www.npmjs.com/package/@mlc-ai/web-llm), the app uses TypeScript, React, Jotai, and Tailwind. It's built with Vite and SWC.

## Usage

```sh
# localhost:5173
npm install
npm start
```

## Known issues

I'm currently using Windows/Edge stable on a Lenovo laptop with a RTX 2080 6GB.

Using the demo app at [webllm.mlc.ai](https://webllm.mlc.ai), I did not have to enable any flags to get the `q4f32` quantized models to work (`f16` requires a flag). Go to [webgpureport.org](https://webgpureport.org) to inspect your system's WebGPU capabilities.

### Fetch errors

For whatever reason, I have to be behind a VPN to fetch the models from Hugging Face on Windows. 🤷‍♂️

### Cannot find global function

Usually a cache issue.

You can delete an individual cache:

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

## TODO

- [ ] Dark mode
- [ ] Settings menu (temperature, system message, etc.)
- [ ] Inference on web worker
- [ ] Offline/PWA
- [ ] Cache management
- [ ] Image upload for multimodal like [LLaVA](https://llava-vl.github.io)
- [ ] Tailwind class sorting by Biome 🤞
