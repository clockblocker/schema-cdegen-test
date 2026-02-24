export type AllOptional<TObject> = TObject extends object
	? {
			[TKey in keyof TObject]?: TObject[TKey];
		}
	: TObject;

export type SetNonNullable<TObject, TKeys extends PropertyKey> =
	TObject extends object
		? Omit<TObject, Extract<TKeys, keyof TObject>> & {
				[TKey in Extract<TKeys, keyof TObject>]-?: NonNullable<TObject[TKey]>;
			}
		: TObject;
