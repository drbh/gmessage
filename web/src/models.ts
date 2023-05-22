export default [
	{
		modelUrl: 'https://gpt4all.io/models/ggml-mpt-7b-chat.bin',
		modelName: 'ggml-mpt-7b-chat.bin',
		md5sum: '756249d3d6abe23bde3b1ae272628640',
		description:
			'Current best non-commercially licensable chat model based on MPT and trained by Mosaic ML.',
		default: true,
		commerciallyUsable: false,
		baseModel: 'MPT',
		modelSize: '7B',
		trainingEntity: 'Mosaic ML',
		size: 4_854_401_050
	},
	{
		modelUrl: 'https://gpt4all.io/models/ggml-gpt4all-j-v1.3-groovy.bin',
		modelName: 'ggml-gpt4all-j-v1.3-groovy.bin',
		md5sum: '81a09a0ddf89690372fc296ff7f625af',
		description:
			'Current best commercially licensable model based on GPT-J and trained by Nomic AI on the latest curated GPT4All dataset.',
		default: true,
		commerciallyUsable: true,
		baseModel: 'GPT-J',
		modelSize: undefined,
		trainingEntity: 'Nomic AI',
		size: 3_785_248_281
	},
	{
		modelUrl: 'https://gpt4all.io/models/ggml-gpt4all-l13b-snoozy.bin',
		modelName: 'ggml-gpt4all-l13b-snoozy.bin',
		md5sum: '91f886b68fbce697e9a3cd501951e455',
		description:
			'Current best non-commercially licensable model based on Llama 13b and trained by Nomic AI on the latest curated GPT4All dataset.',
		default: false,
		commerciallyUsable: false,
		baseModel: 'Llama',
		modelSize: '13B',
		trainingEntity: 'Nomic AI',
		size: undefined
	},
	{
		modelUrl: 'https://gpt4all.io/models/ggml-gpt4all-j-v1.2-jazzy.bin',
		modelName: 'ggml-gpt4all-j-v1.2-jazzy.bin',
		md5sum: '879344aaa9d62fdccbda0be7a09e7976',
		description:
			'A commercially licensable model based on GPT-J and trained by Nomic AI on the v2 GPT4All dataset.',
		default: false,
		commerciallyUsable: true,
		baseModel: 'GPT-J',
		modelSize: undefined,
		trainingEntity: 'Nomic AI',
		size: undefined
	},
	{
		modelUrl: 'https://gpt4all.io/models/ggml-gpt4all-j-v1.1-breezy.bin',
		modelName: 'ggml-gpt4all-j-v1.1-breezy.bin',
		md5sum: '61d48a82cb188cceb14ebb8082bfec37',
		description:
			'A commercially licensable model based on GPT-J and trained by Nomic AI on the v1 GPT4All dataset.',
		default: false,
		commerciallyUsable: true,
		baseModel: 'GPT-J',
		modelSize: undefined,
		trainingEntity: 'Nomic AI',
		size: undefined
	},
	{
		modelUrl: 'https://gpt4all.io/models/ggml-gpt4all-j.bin',
		modelName: 'ggml-gpt4all-j.bin',
		md5sum: '5b5a3f9b858d33b29b52b89692415595',
		description:
			'A commercially licensable model based on GPT-J and trained by Nomic AI on the v0 GPT4All dataset.',
		default: false,
		commerciallyUsable: true,
		baseModel: 'GPT-J',
		modelSize: undefined,
		trainingEntity: 'Nomic AI',
		size: undefined
	},
	{
		modelUrl: 'https://gpt4all.io/models/ggml-vicuna-7b-1.1-q4_2.bin',
		modelName: 'ggml-vicuna-7b-1.1-q4_2.bin',
		md5sum: '29119f8fa11712704c6b22ac5ab792ea',
		description:
			'An non-commercially licensable model based on Llama 7b and trained by teams from UC Berkeley, CMU, Stanford, MBZUAI, and UC San Diego.',
		default: false,
		commerciallyUsable: false,
		baseModel: 'Llama',
		modelSize: '7B',
		trainingEntity: 'UC Berkeley, CMU, Stanford, MBZUAI, and UC San Diego',
		size: 4_212_859_520
	},
	{
		modelUrl: 'https://gpt4all.io/models/ggml-vicuna-13b-1.1-q4_2.bin',
		modelName: 'ggml-vicuna-13b-1.1-q4_2.bin',
		md5sum: '95999b7b0699e2070af63bf5d34101a8',
		description:
			'An non-commercially licensable model based on Llama 13b and trained by teams from UC Berkeley, CMU, Stanford, MBZUAI, and UC San Diego.',
		default: false,
		commerciallyUsable: false,
		baseModel: 'Llama',
		modelSize: '13B',
		trainingEntity: 'UC Berkeley, CMU, Stanford, MBZUAI, and UC San Diego',
		size: undefined
	},
	{
		modelUrl: 'https://gpt4all.io/models/ggml-wizardLM-7B.q4_2.bin',
		modelName: 'ggml-wizardLM-7B.q4_2.bin',
		md5sum: '99e6d129745a3f1fb1121abed747b05a',
		description:
			'An non-commercially licensable model based on Llama 7b and trained by Microsoft and Peking University.',
		default: false,
		commerciallyUsable: false,
		baseModel: 'Llama',
		modelSize: '7B',
		trainingEntity: 'Microsoft and Peking University',
		size: 4_212_864_640
	},
	{
		modelUrl: 'https://gpt4all.io/models/ggml-stable-vicuna-13B.q4_2.bin',
		modelName: 'ggml-stable-vicuna-13B.q4_2.bin',
		md5sum: '6cb4ee297537c9133bddab9692879de0',
		description:
			'An non-commercially licensable model based on Llama 13b and RLHF trained by Stable AI.',
		default: false,
		commerciallyUsable: false,
		baseModel: 'Llama',
		modelSize: '13B',
		trainingEntity: 'Stable AI',
		size: undefined
	},
	{
		modelUrl: 'https://gpt4all.io/models/ggml-mpt-7b-base.bin',
		modelName: 'ggml-mpt-7b-base.bin',
		md5sum: '120c32a51d020066288df045ef5d52b9',
		description: 'A commercially licensable model base pre-trained by Mosaic ML.',
		default: false,
		commerciallyUsable: true,
		baseModel: 'MPT',
		modelSize: '7B',
		trainingEntity: 'Mosaic ML',
		size: 4_854_401_028 // guess
	},
	{
		modelUrl: 'https://gpt4all.io/models/ggml-nous-gpt4-vicuna-13b.bin',
		modelName: 'ggml-nous-gpt4-vicuna-13b.bin',
		md5sum: 'd5eafd5b0bd0d615cfd5fd763f642dfe',
		description:
			'A non-commercially licensable model based on Vicuna 13b, fine-tuned on ~180,000 instructions, trained by Nous Research.',
		default: false,
		commerciallyUsable: false,
		baseModel: 'Vicuna',
		modelSize: '13B',
		trainingEntity: 'Nous Research',
		size: undefined
	},
	{
		modelUrl: 'https://gpt4all.io/models/ggml-mpt-7b-instruct.bin',
		modelName: 'ggml-mpt-7b-instruct.bin',
		md5sum: '1cfa4958f489f0a0d1ffdf6b37322809',
		description: 'A commercially licensable instruct model based on MPT and trained by Mosaic ML.',
		default: false,
		commerciallyUsable: true,
		baseModel: 'MPT',
		modelSize: '7B',
		trainingEntity: 'Mosaic ML',
		size: 4_854_401_028
	}
];
