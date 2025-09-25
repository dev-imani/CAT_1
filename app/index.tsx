import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function Index() {
  const [inputValue, setInputValue] = useState("");
  const [fromBase, setFromBase] = useState(10); // Default: Decimal
  const [results, setResults] = useState({
    decimal: "",
    binary: "",
    octal: "",
    hexadecimal: ""
  });

  const validateInput = (value: string, base: number): boolean => {
    if (!value.trim()) return false;
    
    switch (base) {
      case 2: // Binary
        return /^[01]+$/.test(value.trim());
      case 8: // Octal
        return /^[0-7]+$/.test(value.trim());
      case 10: // Decimal
        return /^[0-9]+$/.test(value.trim());
      case 16: // Hexadecimal
        return /^[0-9A-Fa-f]+$/.test(value.trim());
      default:
        return false;
    }
  };

  const convertNumber = () => {
    if (!inputValue.trim()) {
      Alert.alert("Error", "Please enter a number");
      return;
    }

    if (!validateInput(inputValue, fromBase)) {
      const baseNames = { 2: "binary", 8: "octal", 10: "decimal", 16: "hexadecimal" };
      Alert.alert("Error", `Please enter a valid ${baseNames[fromBase as keyof typeof baseNames]} number`);
      return;
    }

    try {
      // Convert input to decimal first
      const decimalValue = parseInt(inputValue.trim(), fromBase);
      
      if (isNaN(decimalValue) || decimalValue < 0) {
        Alert.alert("Error", "Please enter a valid positive number");
        return;
      }

      // Convert to all bases
      setResults({
        decimal: decimalValue.toString(10),
        binary: decimalValue.toString(2),
        octal: decimalValue.toString(8),
        hexadecimal: decimalValue.toString(16).toUpperCase()
      });
    } catch (error) {
      Alert.alert("Error", "Invalid input. Please check your number.");
    }
  };

  const clearAll = () => {
    setInputValue("");
    setResults({
      decimal: "",
      binary: "",
      octal: "",
      hexadecimal: ""
    });
  };

  const setInputBase = (base: number) => {
    setFromBase(base);
    setInputValue("");
    clearAll();
  };

  const getBaseInfo = (base: number) => {
    switch (base) {
      case 2: return { name: "Binary", example: "1010", chars: "0-1" };
      case 8: return { name: "Octal", example: "12", chars: "0-7" };
      case 10: return { name: "Decimal", example: "10", chars: "0-9" };
      case 16: return { name: "Hexadecimal", example: "A", chars: "0-9, A-F" };
      default: return { name: "Unknown", example: "", chars: "" };
    }
  };

  const currentBase = getBaseInfo(fromBase);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Number System Converter</Text>
      
      {/* Base Selection */}
      <View style={styles.baseSelection}>
        <Text style={styles.sectionTitle}>Select Input Base:</Text>
        <View style={styles.baseButtons}>
          {[
            { base: 10, name: "Decimal" },
            { base: 2, name: "Binary" },
            { base: 8, name: "Octal" },
            { base: 16, name: "Hex" }
          ].map(({ base, name }) => (
            <TouchableOpacity
              key={base}
              style={[
                styles.baseButton,
                fromBase === base && styles.activeBaseButton
              ]}
              onPress={() => setInputBase(base)}
            >
              <Text style={[
                styles.baseButtonText,
                fromBase === base && styles.activeBaseButtonText
              ]}>
                {name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Input Section */}
      <View style={styles.inputSection}>
        <Text style={styles.inputLabel}>
          Enter {currentBase.name} Number
        </Text>
        <Text style={styles.inputHint}>
          Valid characters: {currentBase.chars} (e.g., {currentBase.example})
        </Text>
        <TextInput
          style={styles.input}
          placeholder={`Enter ${currentBase.name.toLowerCase()} number...`}
          value={inputValue}
          onChangeText={setInputValue}
          keyboardType={fromBase === 16 ? "default" : "numeric"}
        />
        <TouchableOpacity style={styles.convertButton} onPress={convertNumber}>
          <Text style={styles.buttonText}>Convert to All Bases</Text>
        </TouchableOpacity>
      </View>

      {/* Results Section */}
      <View style={styles.resultsSection}>
        <Text style={styles.sectionTitle}>Conversion Results:</Text>
        
        {[
          { base: 10, name: "Decimal", value: results.decimal, prefix: "" },
          { base: 2, name: "Binary", value: results.binary, prefix: "0b" },
          { base: 8, name: "Octal", value: results.octal, prefix: "0o" },
          { base: 16, name: "Hexadecimal", value: results.hexadecimal, prefix: "0x" }
        ].map(({ base, name, value, prefix }) => (
          <View key={base} style={styles.resultRow}>
            <View style={styles.resultLabel}>
              <Text style={styles.resultBaseName}>{name}</Text>
              <Text style={styles.resultBaseInfo}>(Base {base})</Text>
            </View>
            <View style={styles.resultValue}>
              <Text style={styles.resultText}>
                {value ? `${prefix}${value}` : "---"}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Clear Button */}
      <TouchableOpacity style={styles.clearButton} onPress={clearAll}>
        <Text style={styles.clearButtonText}>Clear All</Text>
      </TouchableOpacity>
      
      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 40,
    marginBottom: 30,
    color: "#333",
  },
  baseSelection: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    color: "#333",
    textAlign: "center",
  },
  baseButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  baseButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginHorizontal: 2,
    marginVertical: 2,
    minWidth: "22%",
    alignItems: "center",
  },
  activeBaseButton: {
    backgroundColor: "#007AFF",
  },
  baseButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  activeBaseButtonText: {
    color: "white",
  },
  inputSection: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    color: "#333",
  },
  inputHint: {
    fontSize: 12,
    color: "#666",
    marginBottom: 15,
    fontStyle: "italic",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: "#fafafa",
  },
  convertButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  resultsSection: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  resultLabel: {
    flex: 1,
  },
  resultBaseName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  resultBaseInfo: {
    fontSize: 12,
    color: "#666",
  },
  resultValue: {
    flex: 1,
    alignItems: "flex-end",
  },
  resultText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007AFF",
    fontFamily: "monospace",
  },
  clearButton: {
    backgroundColor: "#FF3B30",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  clearButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  spacer: {
    height: 20,
  },
})
