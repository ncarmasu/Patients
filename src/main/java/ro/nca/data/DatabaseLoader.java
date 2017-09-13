package ro.nca.data;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import ro.nca.data.model.Doctor;
import ro.nca.data.model.Patient;
import ro.nca.data.model.Visit;
import ro.nca.data.model.VisitType;
import ro.nca.data.repositories.DoctorRepo;
import ro.nca.data.repositories.PatientsRepo;
import ro.nca.data.repositories.VisitsRepo;

import java.time.LocalDateTime;
import java.time.Month;
import java.util.Arrays;
import java.util.List;

/**
 * @author Narcis
 */
@Component
public class DatabaseLoader implements CommandLineRunner {

    private final PatientsRepo patientsRepo;
    private final VisitsRepo visitsRepo;
    private final DoctorRepo doctorRepo;

    @Autowired
    public DatabaseLoader(PatientsRepo repository, VisitsRepo visitsRepo, DoctorRepo doctorRepo) {
        this.patientsRepo = repository;
        this.visitsRepo = visitsRepo;
        this.doctorRepo = doctorRepo;
    }

    @Override
    public void run(String... strings) throws Exception {

        Doctor doctor = doctorRepo.save(new Doctor("a", "a"));
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("a", "doesn't matter",
                        AuthorityUtils.createAuthorityList("ROLE_DOCTOR")));
        Patient frodo = new Patient("Frodo", "Baggins", doctor);
        frodo.setVisits(getVisits(frodo, doctor));
        this.patientsRepo.save(frodo);
        this.patientsRepo.save(new Patient("Bilbo", "Baggins", doctor));
        this.patientsRepo.save(new Patient("Meriadoc", "Brandybuck", doctor));
        this.patientsRepo.save(new Patient("Peregrin", "Took", doctor));

        doctor = doctorRepo.save(new Doctor("b", "b"));
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("b", "doesn't matter",
                        AuthorityUtils.createAuthorityList("ROLE_DOCTOR")));
        this.patientsRepo.save(new Patient("Gandalf", "the Grey", doctor));
        this.patientsRepo.save(new Patient("Samwise", "Gamgee", doctor));
        SecurityContextHolder.clearContext();
    }

    private List<Visit> getVisits(Patient patient, Doctor doctor) {
        LocalDateTime firstVisitDate = LocalDateTime.of(2012, Month.DECEMBER, 21, 0, 0);
        LocalDateTime secondVisitDate = firstVisitDate.plusMonths(1);


        Visit visit1 = new Visit(VisitType.CONSULTATION, "First Visit", firstVisitDate);
        visit1.setPatient(patient);
        visit1.setDoctor(doctor);
        Visit visit2 = new Visit(VisitType.CONSULTATION, "Second Visit", secondVisitDate);
        visit2.setPatient(patient);
        visit2.setDoctor(doctor);
        return Arrays.asList(visit1, visit2);
    }
}
