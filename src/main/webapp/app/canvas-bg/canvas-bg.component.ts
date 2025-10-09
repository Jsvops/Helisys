import { Component, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';

type BlobDef = { nx: number; ny: number; rX: number; rY: number; rot: number; color: string; };

@Component({
  selector: 'app-canvas-bg',
  standalone: true,
  template: `<canvas #camuflaje class="bg-camo"></canvas>`,
  styleUrl: './canvas-bg.component.scss'
})
export class CanvasBgComponent implements AfterViewInit {
  @ViewChild('camuflaje', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private readonly colors = ['#69735a', '#657058', '#6e7862', '#62694b'];
  private blobs: BlobDef[] = [];
  private readonly N_BLOBS = 200;

  ngAfterViewInit(): void {
    const ctx = this.canvasRef.nativeElement.getContext('2d');
    if (!ctx) return;
    this.ctx = ctx;
    this.initBlobs();
    this.resizeCanvas();
    this.draw();
  }

  @HostListener('window:resize')
  onResize() {
    this.resizeCanvas();
    this.draw();
  }

  private initBlobs() {
    if (this.blobs.length) return;
    for (let i = 0; i < this.N_BLOBS; i++) {
      this.blobs.push({
        nx: Math.random(),
        ny: Math.random(),
        rX: Math.random() * 0.10 + 0.08,
        rY: Math.random() * 0.06 + 0.04,
        rot: Math.random() * Math.PI * 2,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
      });
    }
  }

  private resizeCanvas() {
    const canvas = this.canvasRef.nativeElement;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    canvas.width  = Math.floor(window.innerWidth  * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    this.ctx.setTransform(1,0,0,1,0,0);
    this.ctx.scale(dpr, dpr);
  }

  private draw() {
    const ctx = this.ctx;
    const w = window.innerWidth;
    const h = window.innerHeight;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#555f4b';
    ctx.fillRect(-1, -1, w + 2, h + 2);

    for (const b of this.blobs) {
      const x = b.nx * w, y = b.ny * h, rX = b.rX * w, rY = b.rY * h;
      this.generateBlob(x, y, rX, rY, b.rot, b.color);
    }
  }

  private generateBlob(x: number, y: number, radiusX: number, radiusY: number, rotation: number, color: string) {
    const ctx = this.ctx;
    ctx.beginPath();
    const numPoints = 15, step = (Math.PI * 2) / numPoints;
    for (let i = 0; i < numPoints; i++) {
      const dv = Math.random() * 50 - 25;
      const angle = i * step + rotation;
      ctx.lineTo(x + (radiusX + dv) * Math.cos(angle),
                 y + (radiusY + dv) * Math.sin(angle));
    }
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }
}
