export interface Chip {
    title: string;
    value: string;
    subtext: string;
    chips: {
        value: string,
        label: string,
    }[]
    percentage?: number;
}