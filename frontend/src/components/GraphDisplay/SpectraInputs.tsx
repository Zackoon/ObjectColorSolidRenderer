// SpectraInputs.tsx

import { Stack, Button, TextInput, FileInput } from "@mantine/core";
import { useState } from "react";
import DropdownContent from "../Dropdown/DropdownContent";
import DropdownButton from "../Dropdown/DropdownButton";
import { useAppContext } from "../AppLayout";

export default function SpectraInputs() {
  const [open, setOpen] = useState(false);
  const {
    conePeaks,
    setConePeaks,
    submitSwitch,
    setSubmitSwitch,
    wavelengthBounds,
    setWavelengthBounds,
    responseFileName,
    setResponseFileName, // **Using context's setter**
  } = useAppContext();

  const [file, setFile] = useState<File | null>(null);

  const handleConeInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setConePeaks({
      ...conePeaks,
      [name]: Number(value),
    });
  };

  const handleBoundsInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setWavelengthBounds({
      ...wavelengthBounds,
      [name]: Number(value),
    });
  };

  const handleResponseFileNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setResponseFileName(event.target.value); // **Using context's setter**
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent page reload
    setSubmitSwitch(-1 * submitSwitch);
    console.log('Form data:', conePeaks);
    console.log(wavelengthBounds);
    console.log('Response File Name:', responseFileName); // **Logging context's responseFileName**
    // You can send the form data to an API or process it here
  };

  const handleFileUpload = async () => {
    if (!file) {
      console.error('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/upload_file', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('File upload failed');
      }

      const result = await response.json();
      console.log('File uploaded successfully:', result);
      // Trigger a re-render or update of the OCS here if needed
      setSubmitSwitch(-1 * submitSwitch);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div>
      <DropdownButton open={open} setOpen={setOpen} leftDropdown={false} />
      <DropdownContent open={open}>
        <Stack gap="m">
          <form onSubmit={handleSubmit}>
            {/* Uncomment and update if you need Cone Peak inputs
            <TextInput
              label="S Cone Peak"
              placeholder={String(DEFAULT_S_PEAK)}
              name="sConePeak"
              type="number"
              value={conePeaks.sConePeak}
              onChange={handleConeInputChange}
              required
              mb="sm"
            />
            <TextInput
              label="M Cone Peak"
              placeholder={String(DEFAULT_M_PEAK)}
              name="mConePeak"
              type="number"
              value={conePeaks.mConePeak}
              onChange={handleConeInputChange}
              required
              mb="sm"
            />
            <TextInput
              label="L Cone Peak"
              placeholder={String(DEFAULT_L_PEAK)}
              name="lConePeak"
              type="number"
              value={conePeaks.lConePeak}
              onChange={handleConeInputChange}
              required
              mb="sm"
            />
            */}
            <TextInput
              label="Minimum Wavelength"
              placeholder="Minimum Wavelength"
              name="min"
              type="number"
              value={wavelengthBounds.min}
              onChange={handleBoundsInputChange}
              required
              // mb="sm"
            />
            <TextInput
              label="Maximum Wavelength"
              placeholder="Maximum Wavelength"
              name="max"
              type="number"
              value={wavelengthBounds.max}
              onChange={handleBoundsInputChange}
              required
              // mb="sm"
            />
            <TextInput
              label="File Name"
              placeholder="Response File Name"
              name="responseFileName"
              type="text"
              value={responseFileName} // **Using context's value**
              onChange={handleResponseFileNameChange}
              // required
              // mb="sm"
            />
            <FileInput
              label="File Upload"
              placeholder="Choose file"
              onChange={setFile}
              accept=".txt,.csv"
              mb="sm"
            />
            <Button onClick={handleFileUpload} disabled={!file} mb="sm">
              Upload File
            </Button>
            <Button type="submit" fullWidth>
              Submit
            </Button>
          </form>
        </Stack>
      </DropdownContent>
    </div>
  );
}