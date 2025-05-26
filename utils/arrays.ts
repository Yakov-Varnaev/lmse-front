export function deepCopy(inObject: any): any {
	return JSON.parse(JSON.stringify(inObject))
}

export function shuffleArray<T>(a: T[]): T[] {
	let newArray = JSON.parse(JSON.stringify(a));
	for (let i = newArray.length - 1; i >= 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[newArray[i], newArray[j]] = [newArray[j], newArray[i]];
	}
	return newArray;
}

export function getRandom(a: any[]): any {
	return a[Math.floor(Math.random() * a.length)]
}
