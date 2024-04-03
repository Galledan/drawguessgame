import React, { useRef, useState, useEffect } from 'react';
import { BsEraserFill, BsFileEarmarkFill, BsPaintBucket } from 'react-icons/bs';

interface WhiteboardProps {
  width: number;
  height: number;
}

const Whiteboard: React.FC<WhiteboardProps> = ({ width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [penSize, setPenSize] = useState(2);
  const [color, setColor] = useState('#000000'); // Default color is black
  const [filling, setFilling] = useState(false);
  const [eraser, setEraser] = useState(false);

  useEffect(() => {
    if (canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        setCtx(context);
      }
    }
  }, []);

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (filling) {
      fill(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
    } else if (ctx && !eraser) {
      ctx.beginPath();
      ctx.moveTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
      setDrawing(true);
    }
    else if (ctx && eraser) {
      setDrawing(true);
    }
  };

  const draw = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (drawing && ctx) {
      if (eraser) {
        ctx.clearRect(
          event.nativeEvent.offsetX - penSize / 2,
          event.nativeEvent.offsetY - penSize / 2,
          penSize,
          penSize
        );
      } else {
        ctx.lineTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
        ctx.strokeStyle = color;
        ctx.lineWidth = penSize;
        ctx.stroke();
      }
    }
  };

  const endDrawing = () => {
    setDrawing(false);
  };

  const handlePenSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPenSize(Number(event.target.value));
  };

  const handleColorChange = (color: string) => {
    setColor(color);
  };

  const toggleFill = () => {
    setFilling(!filling);
  };

  const toggleEraser = () => {
    setEraser(!eraser);
  };

  const clearCanvas = () => {
    if (ctx) {
      ctx.clearRect(0, 0, width, height);
    }
  };


  const fill = (startX: number, startY: number) => {
    if (!ctx) return;
  
    const imageData = ctx.getImageData(0, 0, width, height);
    const pixelStack: [number, number][] = [[startX, startY]];
    const startColor = ctx.getImageData(startX, startY, 1, 1).data;
    const targetColor = hexToRgb(color);
  
    if (startColor && targetColor) {
      const isSameColor = (a: Uint8ClampedArray, b: Uint8ClampedArray) =>
        a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
  
      while (pixelStack.length) {
        const [x, y] = pixelStack.pop()!;
        let yPos = y; 
  
        while (yPos >= 0 && isSameColor(startColor, imageData.data.slice((yPos * width + x) * 4, (yPos * width + x) * 4 + 4))) {
          yPos--;
        }
        yPos++;
  
        let reachLeft = false;
        let reachRight = false;
  
        while (
          yPos < height &&
          isSameColor(startColor, imageData.data.slice((yPos * width + x) * 4, (yPos * width + x) * 4 + 4))
        ) {
          imageData.data[yPos * width * 4 + x * 4] = targetColor[0];
          imageData.data[yPos * width * 4 + x * 4 + 1] = targetColor[1];
          imageData.data[yPos * width * 4 + x * 4 + 2] = targetColor[2];
          imageData.data[yPos * width * 4 + x * 4 + 3] = 255;
  
          if (x > 0) {
            if (
              isSameColor(
                startColor,
                imageData.data.slice((yPos * width + (x - 1)) * 4, (yPos * width + (x - 1)) * 4 + 4)
              )
            ) {
              if (!reachLeft) {
                pixelStack.push([x - 1, yPos]);
                reachLeft = true;
              }
            } else if (reachLeft) {
              reachLeft = false;
            }
          }
  
          if (x < width - 1) {
            if (
              isSameColor(
                startColor,
                imageData.data.slice((yPos * width + (x + 1)) * 4, (yPos * width + (x + 1)) * 4 + 4)
              )
            ) {
              if (!reachRight) {
                pixelStack.push([x + 1, yPos]);
                reachRight = true;
              }
            } else if (reachRight) {
              reachRight = false;
            }
          }
  
          yPos++;
        }
      }
  
      ctx.putImageData(imageData, 0, 0);
    }
  };
  

  const hexToRgb = (hex: string): [number, number, number] | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [
          parseInt(result[1], 16),
          parseInt(result[2], 16),
          parseInt(result[3], 16),
        ]
      : null;
  };

  return (
    <div className='flex flex-row gap-5'>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseOut={endDrawing}
        className=' bg-white rounded-xl'
      />
      <div className='flex flex-col text-3xl gap-3 items-center justify-center'>
      <input className="block w-full bg-gray-200 appearance-none focus:outline-none focus:bg-gray-300 h-4 rounded-md" type="range" min="1" max="20" value={penSize} onChange={handlePenSizeChange} />
      <input type="color" value={color} onChange={(e) => handleColorChange(e.target.value)} />
      <button onClick={toggleFill}><BsPaintBucket /></button>
      <button onClick={toggleEraser}><BsEraserFill /></button>
      <button onClick={clearCanvas}><BsFileEarmarkFill /></button>
      </div>
     
    </div>
  );
};


export default Whiteboard;
