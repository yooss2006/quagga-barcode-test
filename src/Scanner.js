import React, { useEffect, useState } from "react";
import Quagga from "quagga";
import styled from "styled-components";

const Scanner = ({ onDetected }) => {
  const [allCamera, setAllCamera] = useState();
  const [curDeviceId, setCurDeviceId] = useState();
  useEffect(() => {
    Quagga.CameraAccess.enumerateVideoDevices().then((device) => {
      setAllCamera(device);
      setCurDeviceId(device[0].deviceId);
    });
  }, []);
  useEffect(() => {
    Quagga.init(
      {
        inputStream: {
          type: "LiveStream",
          constraints: {
            width: { min: 640 },
            height: { min: 480 },
            aspectRatio: { min: 1, max: 50 },
            facingMode: "environment",
            deviceId: curDeviceId,
          },
        },
        locator: {
          patchSize: "medium",
          halfSample: true,
        },
        numOfWorkers: 2,
        frequency: 10,
        decoder: {
          readers: ["ean_reader"],
        },
        locate: true,
      },
      (err) => {
        if (err) {
          console.log(err, "error msg");
        }
        Quagga.start();
        return () => {
          Quagga.stop();
        };
      }
    );

    //detecting boxes on stream
    Quagga.onProcessed((result) => {
      var drawingCtx = Quagga.canvas.ctx.overlay,
        drawingCanvas = Quagga.canvas.dom.overlay;

      if (result) {
        if (result.boxes) {
          drawingCtx.clearRect(
            0,
            0,
            Number(drawingCanvas.getAttribute("width")),
            Number(drawingCanvas.getAttribute("height"))
          );
          result.boxes
            .filter(function (box) {
              return box !== result.box;
            })
            .forEach(function (box) {
              Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, {
                color: "green",
                lineWidth: 2,
              });
            });
        }

        if (result.box) {
          Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, {
            color: "#00F",
            lineWidth: 2,
          });
        }

        if (result.codeResult && result.codeResult.code) {
          Quagga.ImageDebug.drawPath(
            result.line,
            { x: "x", y: "y" },
            drawingCtx,
            { color: "red", lineWidth: 3 }
          );
        }
      }
    });

    Quagga.onDetected(detected);
  }, [curDeviceId]);

  const detected = (result) => {
    onDetected(result.codeResult.code);
  };

  const handleCamera = async (e) => {
    const findData = allCamera.find((item) => {
      return item.label === e.target.value;
    });
    findData && setCurDeviceId(findData.deviceId);
    Quagga.stop();
    Quagga.start();
  };

  return (
    <StyleViewport className="container">
      <label>
        <span>Camera</span>
        {allCamera && (
          <select name="input-stream_constraints" onChange={handleCamera}>
            {allCamera &&
              allCamera.map((item) => {
                return <option key={item.deviceId}>{item.label}</option>;
              })}
          </select>
        )}
      </label>
      <div id="interactive" className="viewport" />
    </StyleViewport>
  );
};

const StyleViewport = styled.div`
  position: relative;
  .container,
  #interactive.viewport {
    width: 400px;
    height: 300px;
  }
  .drawingBuffer,
  video {
    width: 400px;
    height: 300px;
    position: absolute;
  }

  #interactive.viewport canvas.drawingBuffer,
  video.drawingBuffer {
    width: 400px;
    height: 300px;
  }
`;

export default Scanner;
