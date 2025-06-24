import React, { useState } from "react";
import { View, Button, ActivityIndicator, Alert } from "react-native";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";

export default function VoiceRecorder({ onResult }: { onResult: (text: string) => void }) {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [loading, setLoading] = useState(false);

  const startRecording = async () => {
    if (recording) {
      await stopRecording();
    }

    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
    } catch (err) {
      console.error("🎤 Start error", err);
      Alert.alert("Mic error", "Could not start recording");
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return;

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);

      if (!uri) {
        Alert.alert("Error", "Recording URI not found");
        return;
      }

      const info = await FileSystem.getInfoAsync(uri);
      console.log("🎧 Audio file info:", info);

      if (!info.exists || info.size === 0) {
        Alert.alert("Mic Error", "Empty or missing recording. Try again.");
        return;
      }

      await transcribe(uri);
    } catch (err) {
      console.error("🛑 Stop error", err);
      Alert.alert("Stop error", "Recording stop failed");
    }
  };

  const transcribe = async (uri: string) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("file", {
      uri,
      name: "recording.mp3", // ✅ Changed to .mp3
      type: "audio/mpeg"     // ✅ More consistent for Whisper
    } as any);
    formData.append("model", "whisper-1");
    formData.append("language", "en");

    try {
      console.log("📤 Uploading to Whisper:", uri);

      const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
        method: "POST",
        headers: {
          Authorization: "Bearer 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"
        },
        body: formData
      });

      const result = await response.json();
      console.log("📝 Whisper result:", result);

      if (result?.text?.trim()) {
        onResult(result.text.trim());
      } else {
        Alert.alert("Whisper", "Whisper returned empty text.");
      }
    } catch (err: any) {
      const errorBody = await err?.response?.text?.();
      console.error("❌ Whisper error:", errorBody || err);
      Alert.alert("Whisper API Error", errorBody || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ marginLeft: 10 }}>
      <Button
        title={recording ? "🛑 Stop" : "🎤 Speak"}
        onPress={recording ? stopRecording : startRecording}
        disabled={loading}
      />
      {loading && <ActivityIndicator color="#00796b" />}
    </View>
  );
}
