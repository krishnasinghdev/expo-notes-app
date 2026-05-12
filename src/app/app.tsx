import React, { useMemo, useState } from "react";

import {
  Alert,
  FlatList,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  useColorScheme,
  useWindowDimensions,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import * as ScreenOrientation from "expo-screen-orientation";
import { SafeAreaView } from "react-native-safe-area-context";

type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
};

const INITIAL_NOTES: Note[] = [
  {
    id: "1",
    title: "Morning Ideas",
    content: "Practice React Native and improve UI consistency.",
    createdAt: "2026-05-12T10:00:00Z",
  },
  {
    id: "2",
    title: "Business Notes",
    content: "Build products with strong operational reliability.",
    createdAt: "2026-05-11T08:30:00Z",
  },
];

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isSystemDark = colorScheme === "dark";
  const [isDark, setIsDark] = useState(isSystemDark);
  const [view, setView] = useState<"list" | "editor">("list");
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [search, setSearch] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const { width, height } = useWindowDimensions();
  const isTablet = width >= 768;
  const isLandscape = width > height;
  const spacing = isTablet ? 32 : 20;
  const cardWidth = isTablet ? width / 2 - spacing * 1.5 : width - spacing * 2;

  const colors = {
    background: isDark ? "#0F172A" : "#F8FAFC",
    card: isDark ? "#1E293B" : "#FFFFFF",
    text: isDark ? "#FFFFFF" : "#111827",
    subText: isDark ? "#CBD5E1" : "#6B7280",
    border: isDark ? "#334155" : "#E5E7EB",
    input: isDark ? "#111827" : "#FFFFFF",
  };

  const filteredNotes = useMemo(() => {
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(search.toLowerCase()) ||
        note.content.toLowerCase().includes(search.toLowerCase()),
    );
  }, [notes, search]);

  const handleSave = (title: string, content: string) => {
    if (title.trim() === "" && content.trim() === "") {
      Alert.alert("Empty Note", "Please add some content.");
      return;
    }

    // EDIT
    if (selectedNote) {
      setNotes((prev) =>
        prev.map((note) =>
          note.id === selectedNote.id
            ? {
                ...note,
                title,
                content,
                createdAt: new Date().toISOString(),
              }
            : note,
        ),
      );
    }
    // CREATE
    else {
      const newNote: Note = {
        id: Date.now().toString(),
        title,
        content,
        createdAt: new Date().toISOString(),
      };

      setNotes((prev) => [newNote, ...prev]);
    }

    setSelectedNote(null);

    setView("list");
  };

  const toggleOrientation = async () => {
    const orientation = await ScreenOrientation.getOrientationAsync();

    const landscape =
      orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
      orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT;

    if (landscape) {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP,
      );
    } else {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE,
      );
    }
  };

  // EDITOR VIEW

  if (view === "editor") {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={80}
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        <ImageBackground
          source={{
            uri: "https://images.unsplash.com/photo-1499750310107-5fef28a66643",
          }}
          style={[
            styles.headerImage,
            {
              height: isLandscape ? 100 : isTablet ? 260 : 220,
            },
          ]}
        >
          <View style={styles.overlay}>
            <Text style={styles.headerText}>
              {selectedNote ? "Edit Note" : "New Note"}
            </Text>
          </View>
        </ImageBackground>

        <EditorView
          selectedNote={selectedNote}
          colors={colors}
          spacing={spacing}
          isLandscape={isLandscape}
          onBack={() => {
            Alert.alert("Discard Changes", "Are you sure?", [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Discard",
                style: "destructive",
                onPress: () => {
                  setSelectedNote(null);
                  setView("list");
                },
              },
            ]);
          }}
          onSave={handleSave}
        />
      </KeyboardAvoidingView>
    );
  }

  // LIST VIEW

  return (
    <SafeAreaView
      edges={["top"]}
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View
        style={[
          styles.topRow,
          {
            paddingHorizontal: spacing,
          },
        ]}
      >
        <Text
          style={[
            styles.heading,
            {
              color: colors.text,
              fontSize: isTablet ? 40 : 30,
            },
          ]}
        >
          My Notes
        </Text>

        <Switch value={isDark} onValueChange={setIsDark} />
      </View>

      <TextInput
        placeholder="Search notes..."
        placeholderTextColor={colors.subText}
        value={search}
        onChangeText={setSearch}
        style={StyleSheet.compose(styles.searchInput, {
          marginHorizontal: spacing,
          backgroundColor: colors.input,
          color: colors.text,
          borderColor: colors.border,
        })}
      />

      <FlatList
        key={isTablet ? "tablet" : "phone"}
        data={filteredNotes}
        keyExtractor={(item) => item.id}
        numColumns={isTablet ? 2 : 1}
        contentContainerStyle={{
          paddingBottom: 140,
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="document-text-outline"
              size={60}
              color={colors.subText}
            />

            <Text
              style={[
                styles.emptyText,
                {
                  color: colors.subText,
                },
              ]}
            >
              No notes found
            </Text>
          </View>
        }
        columnWrapperStyle={
          isTablet
            ? {
                justifyContent: "space-between",

                paddingHorizontal: spacing,
              }
            : undefined
        }
        renderItem={({ item }) => (
          <Pressable
            android_ripple={{
              color: "#ddd",
            }}
            onPress={() => {
              setSelectedNote(item);
              setView("editor");
            }}
            style={({ pressed }) => [
              styles.noteCard,
              {
                width: cardWidth,
                minHeight: 120,
                marginHorizontal: isTablet ? 0 : spacing,
                backgroundColor: colors.card,
                borderColor: colors.border,
                opacity: pressed ? 0.9 : 1,
              },
            ]}
          >
            <Text
              style={[
                styles.noteTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              {item.title}
            </Text>

            <Text
              numberOfLines={4}
              style={[
                styles.notePreview,
                {
                  color: colors.subText,
                },
              ]}
            >
              {item.content}
            </Text>

            <Text
              style={[
                styles.noteDate,
                {
                  color: colors.subText,
                },
              ]}
            >
              {new Date(item.createdAt).toLocaleString()}
            </Text>
          </Pressable>
        )}
      />

      {/* ORIENTATION BUTTON */}

      <Pressable
        style={[
          styles.fab,
          styles.fabLeft,
          {
            width: isTablet ? 80 : 64,
            height: isTablet ? 80 : 64,
            borderRadius: isTablet ? 40 : 32,
            bottom: isLandscape ? 16 : 28,
          },
        ]}
        onPress={toggleOrientation}
      >
        <Ionicons
          name="phone-landscape"
          size={isTablet ? 36 : 30}
          color="#fff"
        />
      </Pressable>

      {/* ADD NOTE BUTTON */}

      <Pressable
        style={[
          styles.fab,
          styles.fabRight,
          {
            width: isTablet ? 80 : 64,
            height: isTablet ? 80 : 64,
            borderRadius: isTablet ? 40 : 32,
            bottom: isLandscape ? 16 : 28,
          },
        ]}
        onPress={() => {
          setSelectedNote(null);
          setView("editor");
        }}
      >
        <Ionicons name="add" size={isTablet ? 36 : 30} color="#fff" />
      </Pressable>
    </SafeAreaView>
  );
}

const EditorView = ({
  selectedNote,
  onBack,
  onSave,
  colors,
  spacing,
  isLandscape,
}: any) => {
  const [title, setTitle] = useState(selectedNote?.title ?? "");
  const [content, setContent] = useState(selectedNote?.content ?? "");

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        flexGrow: 1,
      }}
    >
      <View
        style={[
          styles.editorContainer,
          {
            paddingHorizontal: spacing,

            paddingTop: isLandscape ? 12 : 20,
          },
        ]}
      >
        <View style={styles.editorInner}>
          <TextInput
            autoFocus={!selectedNote}
            placeholder="Title"
            placeholderTextColor={colors.subText}
            value={title}
            onChangeText={setTitle}
            style={StyleSheet.flatten([
              styles.titleInput,
              {
                backgroundColor: colors.input,
                borderColor: colors.border,
                color: colors.text,
              },
            ])}
          />

          <TextInput
            multiline
            textAlignVertical="top"
            placeholder="Write your note..."
            placeholderTextColor={colors.subText}
            value={content}
            onChangeText={setContent}
            style={[
              styles.contentInput,
              {
                minHeight: isLandscape ? 120 : 250,
                backgroundColor: colors.input,
                borderColor: colors.border,
                color: colors.text,
              },
            ]}
          />

          <View style={styles.buttonRow}>
            <Pressable
              onPress={onBack}
              style={[
                styles.button,
                {
                  backgroundColor: "#475569",
                },
              ]}
            >
              <Text style={styles.buttonText}>Back</Text>
            </Pressable>

            <Pressable
              onPress={() => onSave(title, content)}
              style={[
                styles.button,
                {
                  backgroundColor: "#2563EB",
                },
              ]}
            >
              <Text style={styles.buttonText}>
                {selectedNote ? "Update" : "Save"}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 8,
  },
  heading: {
    fontWeight: "700",
  },
  searchInput: {
    marginBottom: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    fontSize: 16,
  },

  noteCard: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 3,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  notePreview: {
    fontSize: 15,
    lineHeight: 22,
  },
  noteDate: {
    marginTop: 12,
    fontSize: 12,
  },
  fab: {
    position: "absolute",
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    elevation: 8,
  },
  fabLeft: {
    left: 20,
  },
  fabRight: {
    right: 20,
  },
  headerImage: {
    justifyContent: "flex-end",
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.35)",
    padding: 20,
  },
  headerText: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "700",
  },
  editorContainer: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 24,
  },

  editorInner: {
    flex: 1,
    width: "100%",
    maxWidth: 1000,
    alignSelf: "center",
  },
  editorColumn: {
    flex: 1,
  },
  titleInput: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 18,
    marginBottom: 18,
  },

  contentInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    fontSize: 16,
    lineHeight: 24,
  },
  buttonRow: {
    gap: 14,
    marginTop: 20,
    flexDirection: "row",
  },
  button: {
    minWidth: 120,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 120,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
  },
});
