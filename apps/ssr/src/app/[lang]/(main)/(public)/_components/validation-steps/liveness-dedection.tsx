"use client";

import React, {useEffect, useRef, useState, useCallback} from "react";
import Webcam from "react-webcam";
import {CheckCircle, XCircle, AlertCircle, AlertTriangle, RefreshCw, Check} from "lucide-react";

import {compareFaces} from "../actions";
import {DocumentData} from "../validation-steps";
import {loadFaceApiModels} from "../liveness/hooks/face-api-utils";
import {DEFAULT_DURATION, expressionInstructions} from "../liveness/constants";
import {useExpressionSequence} from "../liveness/hooks/use-expression-sequence";
import {useExpressionTimer} from "../liveness/hooks/use-expression-timer";
import {useFaceDetection} from "../liveness/hooks/use-face-detection";
import {Expression} from "../liveness/types";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";

// Ses dosyaları - Projedeki mevcut dosyaları kullan
const CORRECT_SOUND_URL = "/voices/correct-voice.mp3"; // Başarılı doğrulama için
const ACCESS_DENIED_SOUND_URL = "/voices/access-denied.mp3"; // Başarısız doğrulama için

// İfade açıklamalarını iyileştir - bunlar constants.ts'deki ifadelerin yerini alacak
const improvedExpressionInstructions: Record<Expression, string> = {
  neutral: "Kameraya doğrudan bakın ve yüzünüzü sabit tutun",
  lookLeft: "Başınızı sola çevirin ve kameraya bakın",
  lookRight: "Başınızı sağa çevirin ve kameraya bakın",
};

export default function LivenessDedection({
  setCanGoNext,
  front,
}: {
  setCanGoNext: (value: boolean) => void;
  front: DocumentData;
}) {
  const webcamRef = useRef<Webcam>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [webcamReady, setWebcamReady] = useState(false); // Webcam hazır olduğunda true olacak
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const captureAttemptedRef = useRef<boolean>(false);
  const [similarity, setSimilarity] = useState<number>(-1);
  const [comparisonStatus, setComparisonStatus] = useState<"pending" | "success" | "warning" | "error">("pending");
  const [livenessComplete, setLivenessComplete] = useState<boolean>(false);
  const router = useRouter();
  // Ses için referanslar
  const successSoundRef = useRef<HTMLAudioElement | null>(null);
  const deniedSoundRef = useRef<HTMLAudioElement | null>(null);
  const playedSoundRef = useRef<boolean>(false); // Ses çalınıp çalınmadığını takip etmek için

  // Ses efektlerini yükle
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Ses dosyalarını dinamik olarak oluştur ve ön yükleme yap
      const successAudio = new Audio();
      successAudio.src = CORRECT_SOUND_URL;
      successAudio.preload = "auto";

      const deniedAudio = new Audio();
      deniedAudio.src = ACCESS_DENIED_SOUND_URL;
      deniedAudio.preload = "auto";

      // Referanslara ata
      successSoundRef.current = successAudio;
      deniedSoundRef.current = deniedAudio;

      // Ses dosyalarını yükle
      successAudio.load();
      deniedAudio.load();
    }
  }, []);

  // Modelleri yükle
  useEffect(() => {
    const loadModels = async () => {
      try {
        await loadFaceApiModels();
        setIsModelLoaded(true);
      } catch (error) {
        // Hata tasarımı ekrana return et ve sayfayı yenilet
        return (() => {
          return (
            <div className="flex h-screen flex-col items-center justify-center bg-red-50">
              <div className="relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700" role="alert">
                <strong className="font-bold">Hata:</strong>
                <span className="block sm:inline"> Model yüklenirken bir sorun oluştu. Lütfen sayfayı yenileyin.</span>
              </div>
              <Button
                onClick={() => {
                  router.refresh();
                }}
                className="mt-4 rounded bg-red-500 px-4 py-2 text-white transition hover:bg-red-600">
                Sayfayı Yenile
              </Button>
            </div>
          );
        })();
      }
    };

    // Use void operator to explicitly mark the promise as ignored
    void loadModels();
  }, []);

  // webcam referansını video referansına bağla
  useEffect(() => {
    if (webcamRef.current?.video) {
      videoRef.current = webcamRef.current.video;
    }
  }, [webcamRef.current]);

  // Resim çekme fonksiyonu
  const captureUserImage = useCallback(() => {
    if (!webcamReady) {
      return;
    }

    if (webcamRef.current?.video && front?.base64) {
      // Canvas boyut hatasını önlemek için video boyutlarını kontrol et
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      if (videoWidth <= 0 || videoHeight <= 0) {
        return;
      }

      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) {
        return;
      }
      // Use void operator to explicitly mark the promise as ignored
      void compareFaces(imageSrc, front.base64).then((res) => {
        setSimilarity(res);

        // Eşleşme eşiği kontrolü - 65% veya üzeri başarılı kabul edilsin
        if (res >= 65) {
          setComparisonStatus("success");
        } else {
          setComparisonStatus("error");
        }

        // Burada henüz setCanGoNext veya ses çalmıyoruz, tüm adımlar tamamlanınca yapılacak
      });
    }
  }, [webcamRef, front, webcamReady]);

  // İfade sekansı yönetimi
  const {
    expressionSequence,
    currentStepIndex,
    isComplete,
    hasNextStep,
    generateRandomSequence,
    goToNextStep,
    resetSequence,
  } = useExpressionSequence();

  // Mevcut ifade
  const currentExpression: Expression | null =
    expressionSequence.length > 0 && currentStepIndex < expressionSequence.length
      ? expressionSequence[currentStepIndex]
      : null;

  // Bileşenin ilk render'ında canlılık testinin tamamlandığı yanlışlıkla işaretlenmesini önlemek için
  const initialRenderRef = useRef(true);

  // Adım tamamlandığında yapılacak işlem
  const handleStepComplete = useCallback(() => {
    // Sekans düzgün oluşturulmuş ve işleniyor mu kontrol et
    if (expressionSequence.length === 0) {
      return;
    }

    if (hasNextStep) {
      goToNextStep();
    } else {
      // Canlılık testini sadece gerçekten tamamlandıysa işaretle
      if (currentStepIndex > 0 && currentStepIndex >= expressionSequence.length - 1) {
        completeLivenessCheck();
      }
    }
  }, [hasNextStep, goToNextStep, currentStepIndex, expressionSequence]);

  // Canlılık testi tamamlandığında çağrılacak fonksiyon
  const completeLivenessCheck = useCallback(() => {
    // Tüm liveness adımları tamamlandığında çağrılır

    // İlk olarak canlılık testini tamamlandı olarak işaretle
    setLivenessComplete(true);

    // Şimdi karşılaştırma sonucunu kontrol et
    if (comparisonStatus === "success" && !playedSoundRef.current) {
      setCanGoNext(true); // Next butonu aktif et - kritik adım
      // Başarılı ses çal ve referansı güncelle
      playedSoundRef.current = true;
      void successSoundRef.current?.play();
    } else if (comparisonStatus === "error" && !playedSoundRef.current) {
      setCanGoNext(false); // Next butonunu pasif bırak
      // Hata sesi çal ve referansı güncelle
      playedSoundRef.current = true;
      void deniedSoundRef.current?.play();
    }
  }, [comparisonStatus, setCanGoNext]);

  // Timer yönetimi
  const {timer, timeRemaining, startTimer, resetTimer, progress} = useExpressionTimer(
    handleStepComplete,
    DEFAULT_DURATION,
  );

  // Yüz tespiti için video referansı adaptörü - TypeScript hatasını düzeltmek için kullanıyoruz
  const videoRefAdapter = useRef<HTMLVideoElement | null>(null);

  // videoRef güncellendiğinde adaptörümüzü de güncelle
  useEffect(() => {
    videoRefAdapter.current = livenessComplete ? null : videoRef.current;
  }, [videoRef.current, livenessComplete]);

  // Yüz tespiti - canlılık testi tamamlandığında durdur
  const {detectionMessage, expressionStatus, resetDetection} = useFaceDetection(
    videoRefAdapter, // RefObject<HTMLVideoElement | null> tipinde bir referans gönder (null değil)
    livenessComplete ? null : currentExpression,
    isModelLoaded && !livenessComplete, // Test tamamlandığında model yüklemeyi durdur
    startTimer,
    resetTimer,
  );

  // İfade "neutral" olduğunda ve algılandığında, daha güvenilir bir şekilde resim çekme
  useEffect(() => {
    let captureTimeout: ReturnType<typeof setTimeout> | null = null;

    if (
      currentExpression === "neutral" &&
      expressionStatus === "detected" &&
      timer !== null &&
      webcamReady && // Webcam hazır olmalı
      !captureAttemptedRef.current
    ) {
      // İlk olarak resim çekimi denendiğini işaretle
      captureAttemptedRef.current = true;

      // Neutral ifadesi algılandıktan 2 saniye sonra resim çek
      // Bu gecikme, videoRef'in tam olarak hazırlanmasını ve 'drawImage' hatasının önlenmesini sağlar
      captureTimeout = setTimeout(() => {
        // Video hazır mı bir kez daha kontrol et
        const video = webcamRef.current?.video;
        if (video && video.videoWidth > 0) {
          captureUserImage();
        } else {
          captureAttemptedRef.current = false;
        }
      }, 2500); // Biraz daha uzun bir süre verelim (2.5 saniye)
    }

    return () => {
      if (captureTimeout) {
        clearTimeout(captureTimeout);
      }
    };
  }, [currentExpression, expressionStatus, timer, captureUserImage, webcamReady]);

  // Tüm ifade sekansı tamamlandığında
  useEffect(() => {
    // İlk render'da veya sekans oluşmadan önce isComplete'in true olmasını önle
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      return;
    }

    // Sekans başlamışsa ve gerçekten tamamlanmışsa livenessComplete'i güncelle
    if (isComplete && !livenessComplete && expressionSequence.length > 0) {
      // En az bir ifade adımını tamamlamış olmalı
      if (currentStepIndex > 0) {
        completeLivenessCheck();
      }
    }
  }, [isComplete, livenessComplete, expressionSequence.length, currentStepIndex]);

  // Süreçlerin doğrulama durumunu gösteren bir özet fonksiyonu
  const getVerificationSummary = useCallback(() => {
    const livenessStatus = livenessComplete ? "✓ Canlılık testi tamamlandı" : "⚠️ Canlılık testi tamamlanmadı";

    let compareStatus = "";
    if (comparisonStatus === "success") {
      compareStatus = "✓ Kimlik doğrulaması başarılı";
    } else if (comparisonStatus === "error") {
      compareStatus = "❌ Kimlik doğrulaması başarısız";
    } else {
      compareStatus = "⚠️ Kimlik doğrulaması yapılmadı";
    }

    // Sorun mesajını hazırla
    let problemMessage = "";
    if (livenessComplete && comparisonStatus === "error") {
      problemMessage = "Yüz eşleşmesi başarısız oldu. Lütfen daha iyi ışık koşullarında tekrar deneyin.";
    } else if (!livenessComplete && comparisonStatus !== "success") {
      problemMessage = "Canlılık testi tamamlanamadı. Lütfen tüm adımları takip ederek tekrar deneyin.";
    }

    return {
      livenessStatus,
      compareStatus,
      allComplete: livenessComplete && comparisonStatus === "success",
      problemMessage,
      showRetry: (livenessComplete && comparisonStatus !== "success") || (!livenessComplete && currentStepIndex > 0),
    };
  }, [livenessComplete, comparisonStatus, currentStepIndex]);

  // İlerleme mesajları - İyileştirilmiş açıklamalar kullanılarak
  const getCurrentInstruction = useCallback(() => {
    if (expressionSequence.length === 0) {
      return "Canlılık testine başlamak için hazırlanıyor...";
    }

    if (currentStepIndex >= expressionSequence.length) {
      return "Tüm adımlar başarıyla tamamlandı! Kimlik doğrulaması yapılıyor...";
    }

    const currentExpr = expressionSequence[currentStepIndex];

    // İyileştirilmiş ifade açıklamalarını kullan
    return (
      improvedExpressionInstructions[currentExpr as keyof typeof improvedExpressionInstructions] ||
      expressionInstructions[currentExpr]
    );
  }, [expressionSequence, currentStepIndex]);

  // İfade durumuna göre mesaj - İyileştirilmiş
  const getExpressionStatusMessage = useCallback(() => {
    if (expressionStatus === "detected") {
      return `İfade başarıyla algılandı! ${timeRemaining} saniye boyunca bu ifadeyi sürdürün`;
    } else if (expressionStatus === "lost") {
      return "İfade kaybedildi, lütfen tekrar deneyiniz ve kameraya bakın";
    }
    return detectionMessage || "Yüzünüzü kameraya bakacak şekilde yerleştirin";
  }, [expressionStatus, timeRemaining, detectionMessage]);

  // Testi yeniden başlat
  const restartTest = useCallback(() => {
    resetTimer();
    resetSequence();
    resetDetection();
    setLivenessComplete(false);
    setComparisonStatus("pending");
    setSimilarity(-1);
    captureAttemptedRef.current = false; // Referansı da sıfırla
  }, [resetTimer, resetSequence, resetDetection]);

  // İlk yükleme veya sayfa değişimi sırasında ifade dizisini oluştur
  useEffect(() => {
    if (expressionSequence.length === 0) {
      generateRandomSequence();
    }
  }, [expressionSequence, generateRandomSequence]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center">
      <div className="relative mt-4 w-full overflow-hidden rounded-xl bg-black shadow-lg">
        {!livenessComplete && (
          <Webcam
            mirrored
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={{
              width: 400,
              height: 300,
              facingMode: "user",
            }}
            style={{width: "100%", height: "auto"}}
            className="rounded-xl"
            onUserMedia={() => {
              setWebcamReady(true);
            }}
          />
        )}

        {/* İfade ilerleme çubuğu - modern tasarım */}
        {!livenessComplete &&
          expressionSequence.length > 0 &&
          currentStepIndex < expressionSequence.length &&
          timer !== null && (
            <div className="absolute bottom-0 left-0 h-1.5 w-full bg-gray-700/50">
              <div
                className="bg-primary h-full transition-all duration-300 ease-in-out"
                style={{width: `${progress}%`}}></div>
            </div>
          )}
      </div>

      <div className="w-full rounded-xl border border-gray-100 bg-white p-5 text-center shadow-md">
        {/* Doğrulama özeti - SADECE canlılık testi tamamlandıktan sonra göster */}
        {livenessComplete && expressionSequence.length > 0 && currentStepIndex > 0 && (
          <div className="bg-primary/5 border-primary/10 mb-4 rounded-lg border p-5 transition-colors duration-300">
            <h3 className="mb-4 text-xl font-medium text-gray-800">Doğrulama Durumu</h3>
            <ul className="mb-6 space-y-3">
              <li className="flex items-center gap-3 font-medium text-gray-700">
                <div className="bg-primary/10 flex h-7 w-7 items-center justify-center rounded-full">
                  <Check className="text-primary h-4 w-4" strokeWidth={3} />
                </div>
                <span>Canlılık testi tamamlandı</span>
              </li>
              <li className="flex items-center gap-3 font-medium text-gray-700">
                <div
                  className={`${
                    comparisonStatus === "success" ? "bg-primary/10" : "bg-red-100"
                  } flex h-7 w-7 items-center justify-center rounded-full`}>
                  {comparisonStatus === "success" ? (
                    <Check className="text-primary h-4 w-4" strokeWidth={3} />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" strokeWidth={3} />
                  )}
                </div>
                <span>
                  {comparisonStatus === "success" ? "Kimlik doğrulaması başarılı" : "Kimlik doğrulaması başarısız"}
                </span>
              </li>
            </ul>
          </div>
        )}

        {/* Liveness doğrulama süreci - henüz tamamlanmadıysa göster */}
        {!livenessComplete && (
          <>
            {/* İyileştirilmiş adım göstergeleri ve başlık */}
            <div className="mb-4">
              {expressionSequence.length > 0 && currentStepIndex < expressionSequence.length && (
                <div className="mb-2 flex items-center justify-between rounded-md bg-gray-50 p-2">
                  <span className="text-sm font-medium text-gray-600">
                    Adım {currentStepIndex + 1}/{expressionSequence.length}
                  </span>
                  <span className="bg-primary/10 text-primary rounded-full px-2 py-1 text-xs font-semibold">
                    Kalan süre: {timeRemaining}s
                  </span>
                </div>
              )}
              <h2 className="mb-3 mt-2 text-xl font-bold text-gray-900">{getCurrentInstruction()}</h2>
            </div>

            {/* Adım göstergeleri */}
            {/* {expressionSequence.length > 0 && (
              <ExpressionIndicators
                sequence={expressionSequence}
                currentIndex={currentStepIndex}
                timerActive={timer !== null}
              />
            )} */}

            {/* Algılama durumu - İyileştirilmiş tasarım */}

            {expressionSequence.length > 0 &&
              currentStepIndex < expressionSequence.length &&
              (() => {
                let statusClass = "";
                let StatusIcon = null;

                if (expressionStatus === "detected") {
                  statusClass = "bg-primary/10 text-primary";
                  StatusIcon = <CheckCircle className="text-primary h-5 w-5" />;
                } else if (expressionStatus === "lost") {
                  statusClass = "border border-red-200 bg-red-50 text-red-700";
                  StatusIcon = <XCircle className="h-5 w-5 text-red-500" />;
                } else {
                  statusClass = "border border-yellow-200 bg-yellow-50 text-yellow-700";
                  StatusIcon = <AlertCircle className="h-5 w-5 text-yellow-500" />;
                }

                return (
                  <div className={`mt-4 rounded-lg p-3 transition-colors duration-300 ${statusClass}`}>
                    <div className="flex items-center gap-2">
                      {StatusIcon}
                      <span className="font-medium">{getExpressionStatusMessage()}</span>
                    </div>
                  </div>
                );
              })()}
          </>
        )}

        {/* Doğrulama özeti - SADECE canlılık testi tamamlandıktan sonra göster */}
        {livenessComplete && expressionSequence.length > 0 && currentStepIndex > 0 && (
          <div className="rounded-lg transition-colors duration-300">
            {similarity >= 0 && (
              <div className="mt-2">
                <p className="mb-3 text-sm font-medium text-gray-600">Kimlik Eşleşme Oranı</p>
                <div className="h-2 w-full rounded-full bg-gray-100">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
                    style={{width: `${similarity}%`}}></div>
                </div>
                <p className="text-primary mt-2 text-right text-sm font-medium">{similarity.toFixed(1)}%</p>
              </div>
            )}

            {/* Sorun mesajı ve tekrar dene butonu */}
            {!getVerificationSummary().allComplete && (
              <div className="mt-5">
                {getVerificationSummary().problemMessage && (
                  <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-800">
                    <p className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      {getVerificationSummary().problemMessage}
                    </p>
                  </div>
                )}
                <button
                  onClick={restartTest}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary/50 inline-flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Tekrar Dene
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
