import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCcw, Gamepad2 } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [highScore, setHighScore] = useState(0);

  const generateFood = useCallback((currentSnake: { x: number, y: number }[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    setFood(generateFood(INITIAL_SNAKE));
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          if (!isGameOver) setIsPaused(p => !p);
          else resetGame();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, isGameOver]);

  useEffect(() => {
    if (isPaused || isGameOver) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
          y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
        };

        // Collision check
        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setIsGameOver(true);
          if (score > highScore) setHighScore(score);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Food check
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const gameInterval = setInterval(moveSnake, 100);
    return () => clearInterval(gameInterval);
  }, [direction, food, isPaused, isGameOver, score, highScore, generateFood]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    const size = canvasRef.current!.width / GRID_SIZE;

    // Clear background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw grid lines
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * size, 0);
      ctx.lineTo(i * size, ctx.canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * size);
      ctx.lineTo(ctx.canvas.width, i * size);
      ctx.stroke();
    }

    // Draw food
    ctx.fillStyle = '#ff00ff';
    ctx.fillRect(
      food.x * size + size / 4,
      food.y * size + size / 4,
      size / 2,
      size / 2
    );

    // Draw snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#00ffff' : '#00ffff';
      ctx.strokeStyle = '#ff00ff';
      ctx.lineWidth = 1;
      
      const padding = isHead ? 0 : 2;
      ctx.fillRect(
        segment.x * size + padding,
        segment.y * size + padding,
        size - padding * 2,
        size - padding * 2
      );
      if (isHead) {
        ctx.strokeRect(
          segment.x * size,
          segment.y * size,
          size,
          size
        );
      }
    });
  }, [snake, food]);

  return (
    <div className="flex flex-col items-center gap-12 font-mono">
      <div className="flex justify-between w-full max-w-[400px] border-b-2 border-glitch-cyan pb-2">
        <div className="flex items-center gap-3">
          <Gamepad2 size={20} className="text-glitch-magenta tear" />
          <span className="text-xl tracking-widest text-glitch-cyan">
            SCR: <span className="font-bold">{score.toString().padStart(4, '0')}</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Trophy size={20} className="text-glitch-magenta" />
          <span className="text-xl tracking-widest text-glitch-cyan opacity-60">
            HI: <span className="font-bold">{highScore.toString().padStart(4, '0')}</span>
          </span>
        </div>
      </div>

      <div className="relative border-4 border-glitch-cyan bg-glitch-cyan/5 p-1 transition-all duration-300">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="relative bg-black"
        />

        <AnimatePresence>
          {(isPaused || isGameOver) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/90"
            >
              <div className="text-center p-8 border-4 border-glitch-magenta bg-black max-w-[80%]">
                {isGameOver ? (
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="flex flex-col items-center gap-6"
                  >
                    <h2 className="text-5xl font-black text-glitch-magenta glitch-magenta tracking-tighter">
                      CRITICAL_FAILURE
                    </h2>
                    <p className="text-glitch-cyan text-sm tracking-[0.3em] uppercase">
                      Score_Retrieved: {score}
                    </p>
                    <button
                      onClick={resetGame}
                      className="px-10 py-4 bg-glitch-magenta text-black font-bold uppercase text-lg tracking-widest hover:transform hover:translate-x-1 hover:translate-y-1 transition-all"
                    >
                      EXECUTE_RESTART
                    </button>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center gap-6">
                    <h2 className="text-5xl font-black text-glitch-cyan glitch-cyan tracking-tighter italic">
                      SYSTEM_HALTED
                    </h2>
                    <p className="text-glitch-magenta/60 text-xs tracking-[0.2em] uppercase">
                      Buffer_Awaiting_Input...
                    </p>
                    <button
                      onClick={() => setIsPaused(false)}
                      className="px-12 py-4 border-4 border-glitch-cyan text-glitch-cyan font-bold uppercase text-lg tracking-widest hover:bg-glitch-cyan hover:text-black transition-all"
                    >
                      RESUME
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-2 gap-8 w-full max-w-[400px]">
        <div className="border-2 border-glitch-cyan p-4 flex flex-col items-center justify-center gap-2 bg-glitch-cyan/5">
          <span className="text-[10px] text-glitch-magenta font-bold tracking-[0.3em]">M_CONTROLS</span>
          <div className="text-glitch-cyan font-bold text-lg tracking-widest">
            DIR_KEYS
          </div>
        </div>
        <div className="border-2 border-glitch-cyan p-4 flex flex-col items-center justify-center gap-2 bg-glitch-cyan/5">
          <span className="text-[10px] text-glitch-magenta font-bold tracking-[0.3em]">S_VITAL</span>
          <span className={`text-lg font-bold tracking-widest ${isPaused ? 'text-glitch-magenta animate-pulse' : 'text-glitch-cyan'}`}>
             {isPaused ? 'TERMINATED' : 'EXECUTING'}
          </span>
        </div>
      </div>
    </div>
  );
}
