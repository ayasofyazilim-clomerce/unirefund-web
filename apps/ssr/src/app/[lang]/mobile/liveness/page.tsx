"use client";
import {ThemeProvider} from "@aws-amplify/ui-react";
import {FaceLivenessDetectorCore} from "@aws-amplify/ui-react-liveness";
import "@aws-amplify/ui-react/styles.css";
import {getAWSEnvoriment} from "@repo/actions/unirefund/AWSService/actions";
import {
  getApiEvidenceSessionPublicCreateFaceLivenessSession,
  getApiEvidenceSessionPublicGetFaceLivenessSessionResults,
} from "@repo/actions/unirefund/TravellerService/actions";
import {useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";

export default function MobileLivenessPage() {
  const searchParams = useSearchParams();
  const evidenceSessionId = searchParams.get("evidenceSessionId");

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [analysisResult, setAnalysisResult] = useState<{isLive: boolean; confidence: number} | null>(null);
  const [awsConfig, setAwsConfig] = useState<{accessKeyId: string; secretAccessKey: string; region: string} | null>(
    null,
  );

  // Mobil için optimize edilmiş tema
  const theme = {
    name: "CustomMobileFaceLivenessTheme",
    tokens: {
      colors: {
        background: {
          primary: {value: "#000000"},
          secondary: {value: "#1a1a1a"},
        },
        font: {
          primary: {value: "#ffffff"},
          secondary: {value: "#d1d5db"},
        },
        brand: {
          primary: {
            "10": "#1e3a8a",
            "80": "#3b82f6",
            "90": "#60a5fa",
            "100": "#93c5fd",
          },
        },
        overlay: {
          "10": "rgba(0, 0, 0, 0.8)",
          "20": "rgba(0, 0, 0, 0.6)",
        },
      },
      space: {
        xs: {value: "0.5rem"},
        small: {value: "1rem"},
        medium: {value: "1.5rem"},
        large: {value: "2rem"},
        xl: {value: "3rem"},
      },
      borderRadius: {
        small: {value: "0.5rem"},
        medium: {value: "0.75rem"},
        large: {value: "1rem"},
      },
    },
  };

  useEffect(() => {
    const initializeConfig = async () => {
      try {
        const clientAuths = await getAWSEnvoriment();
        setAwsConfig(clientAuths);

        if (evidenceSessionId) {
          const res = await getApiEvidenceSessionPublicCreateFaceLivenessSession(evidenceSessionId);
          if (res.type === "success") {
            setSessionId(res.data.sessionId || null);
          }
        }
      } catch {
        // Hata loglanmadı, error kullanılmazsa aşağıdaki satırı ekleyin:
      } finally {
        setIsLoading(false);
      }
    };

    void initializeConfig();
  }, [evidenceSessionId]);

  const handleAnalysisComplete = async () => {
    if (!sessionId) return;

    const result = await getApiEvidenceSessionPublicGetFaceLivenessSessionResults(sessionId);
    if (result.type !== "success") {
      // Liveness analysis failed
      setAnalysisResult({isLive: false, confidence: 0});
      return;
    }

    const confidence = result.data.confidence ?? 0;

    if (confidence > 70) {
      setAnalysisResult({isLive: true, confidence});
    } else {
      setAnalysisResult({isLive: false, confidence});
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-black">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          <div className="text-lg text-white">Yükleniyor...</div>
        </div>
      </div>
    );
  }

  if (!evidenceSessionId) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-black px-4">
        <div className="text-center">
          <div className="mb-4 text-6xl">⚠️</div>
          <div className="mb-2 text-lg text-red-400">Oturum Kimliği Gerekli</div>
          <div className="text-sm text-gray-400">Evidence Session ID parametresi eksik</div>
        </div>
      </div>
    );
  }

  if (!awsConfig) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-black px-4">
        <div className="text-center">
          <div className="mb-4 text-6xl">🔐</div>
          <div className="mb-2 text-lg text-red-400">AWS Kimlik Bilgileri Gerekli</div>
          <div className="text-sm text-gray-400">Sunucu yapılandırması eksik</div>
        </div>
      </div>
    );
  }

  if (!sessionId) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-black px-4">
        <div className="text-center">
          <div className="mb-4 text-6xl">❌</div>
          <div className="mb-2 text-lg text-red-400">Oturum Oluşturulamadı</div>
          <div className="text-sm text-gray-400">Lütfen tekrar deneyin</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-black">
      {analysisResult ? (
        <div className="flex w-full flex-1 items-center justify-center bg-black px-6">
          <div className="w-full max-w-sm text-center">
            {/* Sonuç İkonu */}
            <div className="mb-6">
              {analysisResult.isLive ? (
                <div className="mb-4 text-8xl text-green-500">✅</div>
              ) : (
                <div className="mb-4 text-8xl text-red-500">❌</div>
              )}
            </div>

            {/* Sonuç Metni */}
            <div className={`mb-4 text-xl font-bold ${analysisResult.isLive ? "text-green-400" : "text-red-400"}`}>
              {analysisResult.isLive ? "Canlılık Kontrolü Başarılı" : "Canlılık Kontrolü Başarısız"}
            </div>

            {/* Güven Skoru */}
            <div className="mb-8">
              <div className="mb-2 text-sm text-gray-300">Güven Skoru</div>
              <div className="mb-2 text-2xl font-bold text-white">{analysisResult.confidence.toFixed(1)}%</div>
              {/* Güven Skoru Bar'ı */}
              <div className="h-2 w-full rounded-full bg-gray-700">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    analysisResult.confidence > 70 ? "bg-green-500" : "bg-red-500"
                  }`}
                  style={{width: `${Math.min(analysisResult.confidence, 100)}%`}}></div>
              </div>
            </div>

            {/* Tekrar Dene Butonu */}
            <button
              className="w-full touch-manipulation rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white transition-colors duration-200 hover:bg-blue-700 active:bg-blue-800"
              onClick={() => {
                void (async () => {
                  setAnalysisResult(null);
                  setSessionId(null);
                  setIsLoading(true);

                  if (evidenceSessionId) {
                    try {
                      const res = await getApiEvidenceSessionPublicCreateFaceLivenessSession(evidenceSessionId);
                      if (res.type === "success") {
                        setSessionId(res.data.sessionId || null);
                      }
                    } finally {
                      setIsLoading(false);
                    }
                  }
                })();
              }}>
              Tekrar Dene
            </button>
          </div>
        </div>
      ) : (
        <div className="relative w-full flex-1">
          {/* Üst Bilgi Alanı */}
          <div className="absolute left-0 right-0 top-10 z-10 bg-black/80 p-4 backdrop-blur-sm">
            <div className="text-center">
              <h1 className="mb-1 text-lg font-semibold text-white">Canlılık Kontrolü</h1>
              <p className="text-sm text-gray-300">Kamerayı yüzünüze doğrultun ve talimatları takip edin</p>
            </div>
          </div>

          {/* Liveness Detector */}
          <div className="h-vh w-full">
            <ThemeProvider theme={theme}>
              <FaceLivenessDetectorCore
                config={{
                  credentialProvider: async () => {
                    await Promise.resolve();
                    return awsConfig;
                  },
                }}
                disableStartScreen
                onAnalysisComplete={handleAnalysisComplete}
                region={awsConfig.region}
                sessionId={sessionId}
              />
            </ThemeProvider>
          </div>
        </div>
      )}
    </div>
  );
}
