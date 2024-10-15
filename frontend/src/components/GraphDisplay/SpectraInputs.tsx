import { Stack, Button, TextInput} from "@mantine/core";
import { useState } from "react";
import DropdownContent from "../Dropdown/DropdownContent";
import DropdownButton from "../Dropdown/DropdownButton";
import { DEFAULT_S_PEAK, DEFAULT_M_PEAK, DEFAULT_L_PEAK, useAppContext } from "../AppLayout";


const boxStyle = {
    margin: 10,
    padding: 5,
};



export default function SpectraInputs() {
    const [open, setOpen] = useState(false);
    const { conePeaks, setConePeaks, submitSwitch, setSubmitSwitch, wavelengthBounds, setWavelengthBounds} = useAppContext()
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
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent page reload
        setSubmitSwitch(-1 * submitSwitch)
        console.log('Form data:', conePeaks);
        console.log(wavelengthBounds)
        // You can send the form data to an API or process it here
    };

    return (
        <div>
            <DropdownButton open={open} setOpen={setOpen} leftDropdown={false}></DropdownButton>
            <DropdownContent open={open}>
                <Stack gap="m">
                <form onSubmit={handleSubmit}>
                    {/* <TextInput
                        label="S Cone Peak"
                        placeholder={String(DEFAULT_S_PEAK)}
                        name="sConePeak"
                        type="number"
                        value={conePeaks[0]}
                        onChange={handleInputChange}
                        // required
                        mb="sm" // margin-bottom to space out elements
                    />
                    <TextInput
                        label="M Cone Peak"
                        placeholder={String(DEFAULT_M_PEAK)}
                        name="mConePeak"
                        type="number"
                        value={conePeaks[1]}
                        onChange={handleInputChange}
                        // required
                        mb="sm"
                    />
                    <TextInput
                        label="L Cone Peak"
                        placeholder={String(DEFAULT_L_PEAK)}
                        name="lConePeak"
                        type="number"
                        value={conePeaks[2]}
                        onChange={handleInputChange}
                        // required
                        mb="sm"
                    /> */}
                    <TextInput
                        //label="Minimum Wavelength"
                        placeholder={"Minium Wavelength"}
                        name="min"
                        type="number"
                        value={wavelengthBounds.min}
                        onChange={handleBoundsInputChange}
                        required
                        mb="sm"
                    />
                    <TextInput
                        //label="Maximum Wavelength"
                        placeholder={"Maximum Wavelength"}
                        name="max"
                        type="number"
                        value={wavelengthBounds.max}
                        onChange={handleBoundsInputChange}
                        required
                        mb="sm"
                    />
                    <Button type="submit" fullWidth>
                        Submit
                    </Button>
                </form>
                </Stack>
            </DropdownContent>
        </div>
    )
}