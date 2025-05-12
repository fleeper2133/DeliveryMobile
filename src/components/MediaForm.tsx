import { useState } from "react";

const [file, setFile] = useState(null);

const pickFile = async () => {
  const result = await DocumentPicker.getDocumentAsync();
  if (!result.canceled) {
    setFile(result.assets[0]);
  }
};

return (
  <View>
    <Button title="Выбрать файл" onPress={pickFile} />
    {file && <Text>{file.name}</Text>}
  </View>
);