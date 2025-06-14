"use client"

import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Image } from "react-native"
import * as ImagePicker from "expo-image-picker"
import { supabase } from "../contexts/AuthContext"

export default function AuditScreen({ route, navigation }: any) {
  const { task } = route.params
  const [responses, setResponses] = useState({})
  const [photos, setPhotos] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const takePhoto = async (questionId: string) => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()
    if (status !== "granted") {
      Alert.alert("Permission needed", "Camera permission is required to take photos")
      return
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    })

    if (!result.canceled) {
      setPhotos((prev) => ({
        ...prev,
        [questionId]: result.assets[0].uri,
      }))
    }
  }

  const handleRatingChange = (questionId: string, rating: number) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: rating,
    }))
  }

  const handleMultipleChoiceChange = (questionId: string, option: string) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: option,
    }))
  }

  const submitAudit = async () => {
    setSubmitting(true)

    try {
      // Upload photos to Supabase storage
      const photoUrls = []
      for (const [questionId, photoUri] of Object.entries(photos)) {
        // In a real app, you would upload the photo to Supabase storage
        // and get back a public URL
        photoUrls.push(photoUri)
      }

      // Submit audit data
      const { error } = await supabase.from("audit_submissions").insert({
        task_id: task.id,
        auditor_id: task.auditor_id,
        submission_data: responses,
        photos: photoUrls,
      })

      if (error) throw error

      // Update task status
      await supabase.from("audit_tasks").update({ status: "completed" }).eq("id", task.id)

      Alert.alert("Success", "Audit submitted successfully!", [{ text: "OK", onPress: () => navigation.goBack() }])
    } catch (error) {
      console.error("Error submitting audit:", error)
      Alert.alert("Error", "Failed to submit audit. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const renderQuestion = (question: any, sectionIndex: number, questionIndex: number) => {
    const questionId = `${sectionIndex}_${questionIndex}`

    switch (question.type) {
      case "rating":
        return (
          <View key={questionId} style={styles.questionContainer}>
            <Text style={styles.questionText}>{question.question}</Text>
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((rating) => (
                <TouchableOpacity
                  key={rating}
                  style={[styles.ratingButton, responses[questionId] === rating && styles.ratingButtonSelected]}
                  onPress={() => handleRatingChange(questionId, rating)}
                >
                  <Text style={[styles.ratingText, responses[questionId] === rating && styles.ratingTextSelected]}>
                    {rating}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )

      case "multiple_choice":
        return (
          <View key={questionId} style={styles.questionContainer}>
            <Text style={styles.questionText}>{question.question}</Text>
            <View style={styles.optionsContainer}>
              {question.options.map((option: string, index: number) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.optionButton, responses[questionId] === option && styles.optionButtonSelected]}
                  onPress={() => handleMultipleChoiceChange(questionId, option)}
                >
                  <Text style={[styles.optionText, responses[questionId] === option && styles.optionTextSelected]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )

      case "photo":
        return (
          <View key={questionId} style={styles.questionContainer}>
            <Text style={styles.questionText}>{question.question}</Text>
            <TouchableOpacity style={styles.photoButton} onPress={() => takePhoto(questionId)}>
              <Text style={styles.photoButtonText}>Take Photo</Text>
            </TouchableOpacity>
            {photos[questionId] && <Image source={{ uri: photos[questionId] }} style={styles.photoPreview} />}
          </View>
        )

      default:
        return null
    }
  }

  // Mock template data - in real app this would come from the task
  const templateData = {
    sections: [
      {
        title: "Kitchen Safety",
        questions: [
          {
            type: "rating",
            question: "Rate the overall kitchen cleanliness",
            scale: 5,
            required: true,
          },
          {
            type: "multiple_choice",
            question: "Are food items stored at proper temperatures?",
            options: ["Yes", "No", "Partially"],
            required: true,
          },
          {
            type: "photo",
            question: "Take a photo of the kitchen area",
            required: true,
          },
        ],
      },
    ],
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.taskTitle}>{task.title}</Text>
        <Text style={styles.businessName}>{task.businesses?.name}</Text>
        <Text style={styles.payoutAmount}>Payout: ${task.payout_amount}</Text>
      </View>

      {templateData.sections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.questions.map((question, questionIndex) => renderQuestion(question, sectionIndex, questionIndex))}
        </View>
      ))}

      <TouchableOpacity
        style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
        onPress={submitAudit}
        disabled={submitting}
      >
        <Text style={styles.submitButtonText}>{submitting ? "Submitting..." : "Submit Audit"}</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "white",
    padding: 20,
    marginBottom: 16,
  },
  taskTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  businessName: {
    fontSize: 16,
    color: "#374151",
    marginBottom: 4,
  },
  payoutAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#059669",
  },
  sectionContainer: {
    backgroundColor: "white",
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 16,
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 16,
    color: "#374151",
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: "row",
    gap: 8,
  },
  ratingButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  ratingButtonSelected: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },
  ratingText: {
    fontSize: 16,
    color: "#6b7280",
  },
  ratingTextSelected: {
    color: "white",
  },
  optionsContainer: {
    gap: 8,
  },
  optionButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  optionButtonSelected: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },
  optionText: {
    fontSize: 16,
    color: "#6b7280",
  },
  optionTextSelected: {
    color: "white",
  },
  photoButton: {
    backgroundColor: "#2563eb",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  photoButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  photoPreview: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginTop: 12,
  },
  submitButton: {
    backgroundColor: "#059669",
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
})
