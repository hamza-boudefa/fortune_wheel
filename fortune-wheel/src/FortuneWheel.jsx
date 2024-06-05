import React, { useState, useEffect, useRef } from 'react';
import './Fortune.css';
import img from './sheep.svg';
import axios from 'axios';
import { environment } from './environment';

const sectors = [
  { color: '#fff', label: 'عيدك مبروك', font: 'bold 15px Tajawal, sans-serif', fontColor: '#ef476f' },
  { color: '#ef476f', label: 'علوش', font: 'bold 20px Tajawal, sans-serif', fontColor: '#fff' },
  { color: '#fff', label: 'عيدك مبروك', font: 'bold 15px Tajawal, sans-serif', fontColor: '#ef476f' },
  { color: '#ef476f', label: 'علوش', font: 'bold 20px Tajawal, sans-serif', fontColor: '#fff' },
  { color: '#fff', label: 'عيدك مبروك', font: 'bold 15px Tajawal, sans-serif', fontColor: '#ef476f' },
  { color: '#ef476f', label: 'علوش', font: 'bold 20px Tajawal, sans-serif', fontColor: '#fff' },
];

const rand = (m, M) => Math.random() * (M - m) + m;

const FortuneWheel = ({ userData, onSpinEnd }) => {
  const tot = sectors.length;
  const canvasRef = useRef(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [ang, setAng] = useState(0);
  const [angVel, setAngVel] = useState(0);
  const [angVelMax, setAngVelMax] = useState(0);
  const [isAccelerating, setIsAccelerating] = useState(false);
  const [sectorLabel, setSectorLabel] = useState("SPIN");
  const [sectorColor, setSectorColor] = useState("#ef476f");
  const [result, setResult] = useState('');
  const [showModal, setShowModal] = useState(false);

  const friction = 0.991;
  const angVelMin = 0.002;
  const PI = Math.PI;
  const TAU = 2 * PI;
  const arc = TAU / tot;

  const getIndex = () => Math.floor(tot - ang / TAU * tot) % tot;

  const drawSector = (ctx, sector, i) => {
    const ang = arc * i;
    const rad = ctx.canvas.width / 2;
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = sector.color;
    ctx.moveTo(rad, rad);
    ctx.arc(rad, rad, rad, ang, ang + arc);
    ctx.lineTo(rad, rad);
    ctx.fill();
    ctx.translate(rad, rad);
    ctx.rotate(ang + arc / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = sector.fontColor;
    ctx.font = sector.font;
    ctx.fillText(sector.label, rad - 15, 10);
    ctx.restore();
  };

  const rotate = () => {
    const ctx = canvasRef.current.getContext('2d');
    const sector = sectors[getIndex()];
    ctx.canvas.style.transform = `rotate(${ang - PI / 2}rad)`;
    setSectorLabel(!angVel ? "GO" : sector.label);
  };

  const frame = () => {
    if (!isSpinning) return;

    if (angVel >= angVelMax) setIsAccelerating(false);

    if (isAccelerating) {
      setAngVel(prev => Math.max(prev || angVelMin, angVelMin) * 1.06);
    } else {
      setAngVel(prev => prev * friction);

      if (angVel < angVelMin) {
        setIsSpinning(false);
        setAngVel(0);
        const result = sectors[getIndex()].label;
        setResult(result);
        setShowModal(true);

        if (result === 'علوش') {
          axios.post(`${environment.apiURL}/add_users`, {
            ...userData,
            result,
          })
          .then(response => {
            console.log('User data saved:', response.data);
          })
          .catch(error => {
            console.error('Error saving user data:', error);
          });
        }

        if (onSpinEnd) onSpinEnd(result);
      }
    }

    setAng(prev => (prev + angVel) % TAU);
  };

  useEffect(() => {
    if (isSpinning) {
      const animFrame = requestAnimationFrame(frame);
      return () => cancelAnimationFrame(animFrame);
    }
  }, [isSpinning, angVel]);

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    sectors.forEach((sector, i) => drawSector(ctx, sector, i));
    rotate();
  }, [ang]);

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setIsAccelerating(true);
    setAngVelMax(rand(0.25, 0.40));
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div id="wheelOfFortune">
      <canvas id="wheel" ref={canvasRef} width="300" height="300"></canvas>
      <div className="spin" onClick={handleSpin} style={{ background: sectorColor }}>
        <p style={{ lineHeight: 'normal', fontFamily: 'Tajawal, sans-serif', textShadow: '1px 1px 4px black' }}>{sectorLabel}</p>
      </div>
      {showModal && (
        <div className={`modal ${showModal ? 'show' : ''}`}>
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            {result === 'علوش' ? (
              <div className="msg-container">
                <img src={img} alt="sheep" />
                <span className="msg">مبروك !!</span>
                <p className="msg">دخلت معنا في القرعة بش تربح علوش</p>
              </div>
            ) : (
              <p className="msg">!!! تتمنلك عيد مبروك Microcred</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FortuneWheel;
