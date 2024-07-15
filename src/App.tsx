import { useEffect, useState } from "react";
import wordlist from "./wordlist";
import Word from "./components/word";
import Timer from "./components/timer";
import Collapse from "@mui/material/Collapse";
import { TransitionGroup } from "react-transition-group";

type WordsProps = {
    currentWordID: number;
    correctWords: number;
    wrongWords: number;
};

type TimerProps = {
    time: number;
    isTimerActive: boolean | undefined;
};

type InputProps = {
    input: string;
    isInputCorrect: boolean | undefined;
};

function App() {
    const [usedWords, setUsedWords] = useState<string[]>([]);
    const [correctWordsArray, setCorrectWordsArray] = useState<boolean[]>([]);
    const [count, setCount] = useState<WordsProps>({
        currentWordID: 0,
        correctWords: 0,
        wrongWords: 0,
    });
    const [timer, setTimer] = useState<TimerProps>({
        time: 60,
        isTimerActive: undefined,
    });

    const [input, setInput] = useState<InputProps>({
        input: "",
        isInputCorrect: undefined,
    });
    const [isGameOver, setIsGameOver] = useState<boolean>(false);

    useEffect(getRandomWords, []);
    // Timer ending
    useEffect(() => {
        let timerId: number;

        if (timer.isTimerActive) {
            timerId = setInterval(() => {
                setTimer((prev) => {
                    if (prev.time > 0) {
                        return { ...prev, time: prev.time - 1 };
                    } else {
                        clearInterval(timerId);
                        setIsGameOver(true);
                        return { ...prev, time: 0, isTimerActive: false };
                    }
                });
            }, 1000);
        }
        return () => {
            clearInterval(timerId);
        };
    }, [timer.isTimerActive]);

    function getRandomWords() {
        for (let i = wordlist.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [wordlist[i], wordlist[j]] = [wordlist[j], wordlist[i]];
        }

        wordlist[0] = wordlist[0].charAt(0).toUpperCase() + wordlist[0].slice(1);

        setUsedWords(wordlist.slice(0, 40));
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        const lastChar = value.charAt(value.length - 1);

        if (lastChar === " ") {
            setInput((prev) => ({
                ...prev,
                input: "",
                isInputCorrect: undefined,
            }));
            checkIdentity(input.input);

            if (count.currentWordID === usedWords.length - 1) {
                getRandomWords();
                setCorrectWordsArray([]);
                setCount((p) => ({
                    ...p,
                    currentWordID: 0,
                }));
            }
        } else {
            if (value === usedWords[count.currentWordID].slice(0, value.length)) {
                setInput((prev) => ({
                    ...prev,
                    isInputCorrect: true,
                    input: value,
                }));
            } else {
                setInput((prev) => ({
                    ...prev,
                    isInputCorrect: false,
                    input: value,
                }));
            }
        }

        setTimer((prev) => ({ ...prev, isTimerActive: true }));
    };

    const checkIdentity = (word: string) => {
        if (usedWords[count.currentWordID] === word) {
            setCount((p) => ({
                ...p,
                currentWordID: p.currentWordID + 1,
                correctWords: p.correctWords + 1,
            }));
            setCorrectWordsArray((prev) => [...prev, true]);
        } else {
            setCount((p) => ({
                ...p,
                currentWordID: p.currentWordID + 1,
                wrongWords: p.wrongWords + 1,
            }));
            setCorrectWordsArray((prev) => [...prev, false]);
        }
    };

    function restartGame() {
        setTimer({ time: 60, isTimerActive: undefined });
        getRandomWords();
        setCorrectWordsArray([]);
        setCount({
            currentWordID: 0,
            correctWords: 0,
            wrongWords: 0,
        });

        setInput({
            input: "",
            isInputCorrect: undefined,
        });

        setIsGameOver(false);
    }

    return (
        <>
            <div className="container">
                <h1>TypeMachine</h1>
                <div className="timer-section">
                    <Collapse orientation="horizontal" in={!isGameOver}>
                        <Timer time={timer.time} />
                    </Collapse>
                    <Collapse orientation="horizontal" in={isGameOver}>
                        <h2> Time's up!</h2>
                    </Collapse>
                </div>

                <div className="textbox">
                    {usedWords.map((word, index) => {
                        return (
                            <Word
                                key={index}
                                text={word}
                                isActive={word === usedWords[count.currentWordID]}
                                isCorrect={correctWordsArray[index]}
                            />
                        );
                    })}
                </div>
                <div className="results">
                    <Collapse in={isGameOver}>
                        <h3 className="correct">{count.correctWords}</h3>
                    </Collapse>

                    <Collapse in={isGameOver}>|</Collapse>

                    <Collapse in={isGameOver}>
                        <h3 className="incorrect">{count.wrongWords}</h3>
                    </Collapse>

                    <Collapse in={isGameOver}>
                        <h3>Score: {count.correctWords - count.wrongWords}</h3>
                    </Collapse>
                </div>
                <input
                    disabled={timer.isTimerActive === false}
                    value={input.input}
                    onChange={handleChange}
                    className={`inputbox ${
                        input.isInputCorrect === true ? "correct" : input.isInputCorrect === false ? "incorrect" : ""
                    }`}
                    type="text"
                />
                <button onClick={restartGame}>Restart</button>
            </div>
        </>
    );
}

export default App;
