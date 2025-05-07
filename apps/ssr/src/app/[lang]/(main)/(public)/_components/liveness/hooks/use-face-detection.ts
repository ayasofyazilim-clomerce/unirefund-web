import {useState, useRef, useCallback, useEffect} from "react";
import * as faceapi from "face-api.js";
import {Expression, ExpressionStatus, ExpressionValues} from "../types";
import {thresholds, DETECTION_INTERVAL} from "../constants";

/**
 * Yüz tespiti ve ifade analizi için hook
 */
export const useFaceDetection = (
  videoRef: React.RefObject<HTMLVideoElement | null>,
  currentExpression: Expression | null,
  isModelLoaded: boolean,
  onExpressionDetected: () => void,
  onExpressionLost: () => void,
) => {
  const [expressionValues, setExpressionValues] = useState<ExpressionValues>({});
  const [detectionMessage, setDetectionMessage] = useState("Hazırlanıyor...");
  const [expressionStatus, setExpressionStatus] = useState<ExpressionStatus>("waiting");
  const lastDetectionRef = useRef<boolean>(false);

  // Yüz işaretlerinden kafa dönüş tahmini
  const estimateHeadPose = useCallback((landmarks: faceapi.FaceLandmarks68) => {
    const points = landmarks.positions;

    // Gözlerin pozisyonları - hem iç hem dış köşeleri kullanarak daha doğru ölçüm
    const leftEyeOuter = points[36]; // Sol göz dış köşesi
    const leftEyeInner = points[39]; // Sol göz iç köşesi
    const rightEyeInner = points[42]; // Sağ göz iç köşesi
    const rightEyeOuter = points[45]; // Sağ göz dış köşesi

    // Ağız köşeleri
    const leftMouth = points[48];
    const rightMouth = points[54];

    // Burun ucu ve kökü
    const noseTip = points[30];
    const noseRoot = points[27];

    // Yüzün merkezi (burun ile gözler arası)
    const faceCenter = {
      x: (leftEyeInner.x + rightEyeInner.x) / 2,
      y: (leftEyeInner.y + rightEyeInner.y + noseRoot.y) / 3,
    };

    // Burun sapması hesaplama (normalize edilmiş)
    const eyeWidth = rightEyeOuter.x - leftEyeOuter.x;
    const noseDeviation = (noseTip.x - faceCenter.x) / (eyeWidth / 2);

    // Göz ve ağız köşelerinin asimetri analizi
    const leftEyeWidth = leftEyeInner.x - leftEyeOuter.x;
    const rightEyeWidth = rightEyeOuter.x - rightEyeInner.x;
    const eyeAsymmetry = (leftEyeWidth - rightEyeWidth) / (leftEyeWidth + rightEyeWidth);

    // Ağız asimetrisi
    const mouthCenter = (leftMouth.x + rightMouth.x) / 2;
    const mouthDeviation = (mouthCenter - faceCenter.x) / (eyeWidth / 2);

    // Yüz köşeleri (çene noktaları) için asimetri
    const jawLeft = points[4]; // Sol çene
    const jawRight = points[12]; // Sağ çene
    const jawAsymmetry = (faceCenter.x - jawLeft.x) / (jawRight.x - faceCenter.x);

    // Bileşik değerlendirme
    let lookLeftValue = 0;
    let lookRightValue = 0;

    // Sola bakma için birleşik göstergeler (aslında SAĞA bakmayı temsil eder - ayna etkisi)
    if (noseDeviation < -0.15) {
      // Burada sağa bakma olarak algılanacak - lookRight'a atıyoruz
      lookRightValue += Math.min(Math.abs(noseDeviation) * 1.2, 1); // Burun sapması ağırlıklı

      // Göz asimetrisi belirtisi varsa ek puan
      if (eyeAsymmetry > 0.1) {
        lookRightValue += 0.3;
      }

      // Ağız sapması destekliyorsa ek puan
      if (mouthDeviation < -0.1) {
        lookRightValue += 0.2;
      }

      // Çene asimetrisi destekliyorsa ek puan
      if (jawAsymmetry > 1.1) {
        lookRightValue += 0.2;
      }
    }

    // Sağa bakma için birleşik göstergeler (aslında SOLA bakmayı temsil eder - ayna etkisi)
    if (noseDeviation > 0.15) {
      // Burada sola bakma olarak algılanacak - lookLeft'e atıyoruz
      lookLeftValue += Math.min(noseDeviation * 1.2, 1); // Burun sapması ağırlıklı

      // Göz asimetrisi belirtisi varsa ek puan
      if (eyeAsymmetry < -0.1) {
        lookLeftValue += 0.3;
      }

      // Ağız sapması destekliyorsa ek puan
      if (mouthDeviation > 0.1) {
        lookLeftValue += 0.2;
      }

      // Çene asimetrisi destekliyorsa ek puan
      if (jawAsymmetry < 0.9) {
        lookLeftValue += 0.2;
      }
    }

    // Değerleri normalize et (0-1 aralığına getir)
    lookLeftValue = Math.min(lookLeftValue, 1);
    lookRightValue = Math.min(lookRightValue, 1);

    // Debug bilgisi

    return {
      lookLeft: lookLeftValue,
      lookRight: lookRightValue,
      noseDeviation,
      eyeAsymmetry,
      jawAsymmetry,
    };
  }, []);

  // Yüz tespiti ve ifade analizi
  useEffect(() => {
    if (!isModelLoaded || !currentExpression) return;

    const detectFace = async () => {
      if (videoRef.current?.readyState === 4) {
        const detection = await faceapi
          .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions();

        if (!detection) {
          setDetectionMessage("Yüz algılanamadı - lütfen kameraya bakın");
          setExpressionStatus("waiting");
          lastDetectionRef.current = false;
          return;
        }

        const {expressions, landmarks} = detection;

        // Kafa dönüş açılarını hesapla
        const headPose = estimateHeadPose(landmarks);

        // İfade değerlerini güncelle - İfadeleri ve kafa hareketlerini birleştir
        const updatedValues = {
          neutral: parseFloat(expressions.neutral.toFixed(2)),
          happy: parseFloat(expressions.happy.toFixed(2)),
          lookLeft: parseFloat(headPose.lookLeft.toFixed(2)),
          lookRight: parseFloat(headPose.lookRight.toFixed(2)),
        };

        setExpressionValues(updatedValues);

        // Mevcut ifadeyi kontrol et
        const threshold = thresholds[currentExpression];
        let isExpressionDetected = false;

        if (currentExpression === "lookLeft" || currentExpression === "lookRight") {
          // Kafa hareketi ifadesi için
          isExpressionDetected = updatedValues[currentExpression] > threshold;
        } else {
          // Normal yüz ifadeleri için
          isExpressionDetected = expressions[currentExpression] > threshold;
        }

        if (isExpressionDetected) {
          setDetectionMessage(`${currentExpression} hareketi algılandı - Sabit tutun`);
          setExpressionStatus("detected");
        } else {
          setDetectionMessage(`${currentExpression} hareketi algılanamadı - Lütfen talimatlara uyun`);
          if (lastDetectionRef.current) {
            setExpressionStatus("lost");
            onExpressionLost();
          } else {
            setExpressionStatus("waiting");
          }
          lastDetectionRef.current = false;
        }

        // İfade tespit edilirse callback çağır
        if (isExpressionDetected) {
          lastDetectionRef.current = true;
          onExpressionDetected();
        }
      }
    };

    const interval = setInterval(() => {
      void detectFace(); // void ile promise göz ardı ediliyor, hata gideriliyor
    }, DETECTION_INTERVAL);
    return () => {
      clearInterval(interval);
    };
  }, [isModelLoaded, currentExpression, videoRef, onExpressionDetected, onExpressionLost, estimateHeadPose]);

  // Statüs mesajı ve stil belirleme
  const getExpressionStatusStyle = useCallback(() => {
    switch (expressionStatus) {
      case "detected":
        return "bg-green-100 border-green-200 text-green-700";
      case "lost":
        return "bg-yellow-100 border-yellow-200 text-yellow-700";
      default:
        return "bg-blue-50 border-blue-100 text-blue-700";
    }
  }, [expressionStatus]);

  return {
    expressionValues,
    detectionMessage,
    expressionStatus,
    getExpressionStatusStyle,
    resetDetection: () => {
      lastDetectionRef.current = false;
      setExpressionStatus("waiting");
    },
  };
};
