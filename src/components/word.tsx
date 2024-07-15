type WordProps = {
    text: string;
    isActive: boolean;
    isCorrect: boolean;
};

export default function Word({ text, isActive, isCorrect }: WordProps) {
    if (isCorrect === true) {
        return <span className="correct">{text} </span>;
    } else if (isCorrect === false) {
        return <span className="incorrect">{text} </span>;
    } else if (isActive) {
        return <span className="current">{text} </span>;
    } else return <span>{text} </span>;
}
