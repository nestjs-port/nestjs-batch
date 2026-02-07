export class RepeatStatus {
	static readonly CONTINUABLE = new RepeatStatus(true);

	static readonly FINISHED = new RepeatStatus(false);

	private readonly _continuable: boolean;

	private constructor(continuable: boolean) {
		this._continuable = continuable;
	}

	static continueIf(continuable: boolean): RepeatStatus {
		return continuable ? RepeatStatus.CONTINUABLE : RepeatStatus.FINISHED;
	}

	get isContinuable(): boolean {
		return this === RepeatStatus.CONTINUABLE;
	}

	and(value: boolean): RepeatStatus {
		return value && this._continuable
			? RepeatStatus.CONTINUABLE
			: RepeatStatus.FINISHED;
	}
}
