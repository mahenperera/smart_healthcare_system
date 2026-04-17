package com.shc.patient;

import com.shc.patient.enums.GenderType;
import com.shc.patient.model.Patient;
import com.shc.patient.repository.PatientRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.UUID;

@SpringBootApplication
public class PatientApplication {

	public static void main(String[] args) {
		SpringApplication.run(PatientApplication.class, args);
	}

	@Bean
	CommandLineRunner initDatabase(PatientRepository patientRepository) {
		return args -> {
			UUID dummyId = UUID.fromString("0780f2d5-afec-4f27-8025-b003a26d7f02");
			if (!patientRepository.existsById(dummyId)) {
				Patient patient = new Patient();
				patient.setId(dummyId);
				patient.setNic("19850412854V");
				patient.setName("Alex Johnson");
				patient.setGender(GenderType.MALE);
				patient.setEmail("alex.j@example.com");
				patient.setPhone("+1 (555) 019-2834");
				patientRepository.save(patient);
				System.out.println("Dummy Patient seeded for Frontend MVP.");
			}
		};
	}
}
