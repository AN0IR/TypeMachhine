type TimerProps = {
    time: number;
};

export default function Timer({ time }: TimerProps) {
    return <h2>{time}</h2>;
}
