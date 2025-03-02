import React from 'react';

// Función para verificar si estamos en el navegador
const isBrowser = typeof window !== 'undefined';

// Componente principal del juego
export function BuscaminasGame() {
  // Estado para el nivel de dificultad seleccionado
  const [difficulty, setDifficulty] = React.useState('beginner');
  // Estado para el tablero
  const [board, setBoard] = React.useState<any[][]>([]);
  // Estado para saber si el juego ha terminado
  const [gameOver, setGameOver] = React.useState(false);
  // Estado para saber si el jugador ha ganado
  const [win, setWin] = React.useState(false);
  // Estado para el contador de banderas
  const [flagCount, setFlagCount] = React.useState(0);
  // Estado para las puntuaciones
  const [scores, setScores] = React.useState(() => {
    // Solo acceder a localStorage en el navegador
    if (isBrowser) {
      const savedScores = localStorage.getItem('minesweeperScores');
      return savedScores ? JSON.parse(savedScores) : {
        beginner: [],
        intermediate: [],
        expert: []
      };
    }
    return {
      beginner: [],
      intermediate: [],
      expert: []
    };
  });

  // Configuraciones para los distintos niveles
  const levels = {
    beginner: { rows: 9, cols: 9, mines: 10 },
    intermediate: { rows: 16, cols: 16, mines: 40 },
    expert: { rows: 16, cols: 30, mines: 99 }
  };

  // Función para inicializar el tablero
  const initializeBoard = React.useCallback(() => {
    const { rows, cols, mines } = levels[difficulty as keyof typeof levels];
    setFlagCount(0);
    setGameOver(false);
    setWin(false);
    
    // Crear tablero vacío
    const newBoard = Array(rows).fill(null).map(() => 
      Array(cols).fill(null).map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighbors: 0
      }))
    );
    
    // Colocar minas aleatoriamente
    let minesPlaced = 0;
    while (minesPlaced < mines) {
      const row = Math.floor(Math.random() * rows);
      const col = Math.floor(Math.random() * cols);
      
      if (!newBoard[row][col].isMine) {
        newBoard[row][col].isMine = true;
        minesPlaced++;
      }
    }
    
    // Calcular el número de minas vecinas para cada celda
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (!newBoard[row][col].isMine) {
          let neighbors = 0;
          
          // Verificar las 8 celdas vecinas
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              if (i === 0 && j === 0) continue;
              
              const newRow = row + i;
              const newCol = col + j;
              
              if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                if (newBoard[newRow][newCol].isMine) {
                  neighbors++;
                }
              }
            }
          }
          
          newBoard[row][col].neighbors = neighbors;
        }
      }
    }
    
    setBoard(newBoard);
  }, [difficulty]);

  // Inicializar el tablero cuando cambia la dificultad
  React.useEffect(() => {
    initializeBoard();
  }, [difficulty, initializeBoard]);

  // Función para revelar una celda
  const revealCell = (row: number, col: number) => {
    if (gameOver || win || board[row][col].isRevealed || board[row][col].isFlagged) {
      return;
    }

    const newBoard = [...board];
    
    // Si es una mina, el juego termina
    if (newBoard[row][col].isMine) {
      newBoard[row][col].isRevealed = true;
      setGameOver(true);
      
      // Revelar todas las minas
      for (let r = 0; r < newBoard.length; r++) {
        for (let c = 0; c < newBoard[0].length; c++) {
          if (newBoard[r][c].isMine) {
            newBoard[r][c].isRevealed = true;
          }
        }
      }
      
      setBoard(newBoard);
      return;
    }
    
    // Función para revelar celdas recursivamente
    const revealEmpty = (r: number, c: number) => {
      if (r < 0 || r >= newBoard.length || c < 0 || c >= newBoard[0].length || 
          newBoard[r][c].isRevealed || newBoard[r][c].isFlagged) {
        return;
      }
      
      newBoard[r][c].isRevealed = true;
      
      if (newBoard[r][c].neighbors === 0) {
        // Revelar las 8 celdas vecinas
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            revealEmpty(r + i, c + j);
          }
        }
      }
    };
    
    revealEmpty(row, col);
    setBoard(newBoard);
    
    // Comprobar si el jugador ha ganado
    checkWin(newBoard);
  };

  // Función para marcar una celda con una bandera
  const toggleFlag = (row: number, col: number) => {
    if (gameOver || win || board[row][col].isRevealed) {
      return;
    }

    const newBoard = [...board];
    const { mines } = levels[difficulty as keyof typeof levels];
    
    // Si ya tiene una bandera, quitarla
    if (newBoard[row][col].isFlagged) {
      newBoard[row][col].isFlagged = false;
      setFlagCount(flagCount - 1);
    } 
    // Si no tiene bandera y no se ha alcanzado el límite, ponerla
    else if (flagCount < mines) {
      newBoard[row][col].isFlagged = true;
      setFlagCount(flagCount + 1);
    }
    
    setBoard(newBoard);
  };

  // Función para comprobar si el jugador ha ganado
  const checkWin = (currentBoard: any[][]) => {
    const { rows, cols, mines } = levels[difficulty as keyof typeof levels];
    
    let revealedCount = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (currentBoard[r][c].isRevealed) {
          revealedCount++;
        }
      }
    }
    
    // Si todas las celdas no-mina están reveladas, el jugador gana
    if (revealedCount === rows * cols - mines) {
      setWin(true);
      
      // Guardar puntuación solamente en el navegador
      if (isBrowser) {
        const newScores = {...scores};
        newScores[difficulty] = [
          ...newScores[difficulty],
          {
            date: new Date().toLocaleString(),
            mines: mines
          }
        ].sort((a, b) => b.mines - a.mines).slice(0, 5); // Guardar top 5
        
        setScores(newScores);
        localStorage.setItem('minesweeperScores', JSON.stringify(newScores));
      }
    }
  };

  // Renderizar el tablero
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white">Buscaminas</h1>
      <div className="w-full max-w-3xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-4">
              {Object.keys(levels).map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    difficulty === level
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-md">
                <span className="text-red-500 mr-2">🚩</span>
                <span className="font-medium">{flagCount} / {levels[difficulty as keyof typeof levels].mines}</span>
              </div>
              
              <button
                onClick={initializeBoard}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                Nuevo Juego
              </button>
            </div>
          </div>
          
          {/* Mensaje de fin de juego */}
          {(gameOver || win) && (
            <div className={`mb-4 p-3 rounded text-center ${win ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'}`}>
              {win ? '¡Felicidades! Has ganado!' : '¡Has perdido! Inténtalo de nuevo.'}
            </div>
          )}
          
          {/* Tablero de juego */}
          <div 
            className="grid gap-1 mx-auto"
            style={{ 
              gridTemplateColumns: `repeat(${levels[difficulty as keyof typeof levels].cols}, minmax(0, 1fr))`,
              width: 'fit-content'
            }}
          >
            {board.map((row, rowIdx) => 
              row.map((cell, colIdx) => (
                <Cell 
                  key={`${rowIdx}-${colIdx}`} 
                  cell={cell} 
                  onClick={() => revealCell(rowIdx, colIdx)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    toggleFlag(rowIdx, colIdx);
                  }}
                />
              ))
            )}
          </div>
          
          {/* Sección de puntuaciones */}
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Mejores Puntuaciones</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(scores).map(([level, levelScores]) => (
                <div key={level} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
                  <h3 className="text-lg font-semibold mb-2 capitalize">{level}</h3>
                  {levelScores.length > 0 ? (
                    <ul className="space-y-2">
                      {(levelScores as any[]).map((score, idx) => (
                        <li key={idx} className="flex justify-between">
                          <span>{score.date}</span>
                          <span className="font-medium">{score.mines} minas</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">Sin puntuaciones</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente para una celda individual
function Cell({ cell, onClick, onContextMenu }: { cell: any, onClick: () => void, onContextMenu: (e: React.MouseEvent) => void }) {
  // Determinar el contenido y estilo de la celda
  let content = '';
  let bgColor = 'bg-gray-300 dark:bg-gray-600';
  let textColor = 'text-gray-800 dark:text-white';
  
  if (cell.isFlagged) {
    content = '🚩';
  } else if (cell.isRevealed) {
    if (cell.isMine) {
      content = '💣';
      bgColor = 'bg-red-500';
    } else if (cell.neighbors > 0) {
      content = cell.neighbors.toString();
      
      // Colores para los diferentes números
      const colors = [
        '', // No se usa el índice 0
        'text-blue-600 dark:text-blue-400',
        'text-green-600 dark:text-green-400',
        'text-red-600 dark:text-red-400',
        'text-purple-600 dark:text-purple-400',
        'text-yellow-600 dark:text-yellow-400',
        'text-pink-600 dark:text-pink-400',
        'text-indigo-600 dark:text-indigo-400',
        'text-gray-600 dark:text-gray-400'
      ];
      
      if (cell.neighbors <= 8) {
        textColor = colors[cell.neighbors];
      }
      
      bgColor = 'bg-gray-200 dark:bg-gray-700';
    } else {
      bgColor = 'bg-gray-200 dark:bg-gray-700';
    }
  }
  
  return (
    <button
      onClick={onClick}
      onContextMenu={onContextMenu}
      className={`w-8 h-8 flex items-center justify-center border border-gray-400 dark:border-gray-700 ${bgColor} ${textColor} font-bold text-sm ${!cell.isRevealed && 'hover:bg-gray-400 dark:hover:bg-gray-500'} transition-colors duration-200`}
    >
      {content}
    </button>
  );
}
