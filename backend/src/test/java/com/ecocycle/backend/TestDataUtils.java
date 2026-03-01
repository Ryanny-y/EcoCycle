package com.ecocycle.backend;

import com.ecocycle.backend.record.model.Gender;
import com.ecocycle.backend.record.model.Record;

import java.time.LocalDate;

public class TestDataUtils {

    public static Record createRecordA() {
        return Record.builder()
                .firstName("Juan")
                .middleName("Santos")
                .lastName("Dela Cruz")
                .suffix("Jr")
                .birthDate(LocalDate.parse("1995-06-15"))
                .gender(Gender.MALE)
                .isResident(true)
                .address("123 Barangay Greenfield, Quezon City")
                .contactNumber("09123456789")
                .area(1)
                .subdivision("OTHER")
                .build();
    }

    public static Record createRecordB() {
        return Record.builder()
                .firstName("Maria")
                .middleName("Lopez")
                .lastName("Reyes")
                .suffix(null)
                .birthDate(LocalDate.parse("1998-11-02"))
                .gender(Gender.FEMALE)
                .isResident(false)
                .address("456 Purok Mabuhay, Cebu City")
                .contactNumber("09987654321")
                .area(1)
                .subdivision("OTHER")
                .build();
    }

    public static Record createRecordC() {
        return Record.builder()
                .firstName("Carlos")
                .middleName("Ramos")
                .lastName("Mendoza")
                .suffix("Sr")
                .birthDate(LocalDate.parse("1987-03-22"))
                .gender(Gender.MALE)
                .isResident(false)
                .address("789 Sitio Maligaya, Davao City")
                .contactNumber("09771234567")
                .area(1)
                .subdivision("OTHER")
                .build();
    }

    public static Record createRecordD() {
        return Record.builder()
                .firstName("Maria")
                .middleName("Santos")
                .lastName("Mendoza")
                .suffix("Sr")
                .birthDate(LocalDate.parse("1987-03-22"))
                .gender(Gender.MALE)
                .isResident(true)
                .address("789 Sitio Maligaya, Davao City")
                .contactNumber("09771234567")
                .area(1)
                .subdivision("OTHER")
                .build();
    }
}
