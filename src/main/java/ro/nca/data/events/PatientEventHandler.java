package ro.nca.data.events;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.core.annotation.*;
import org.springframework.hateoas.EntityLinks;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import ro.nca.data.model.Doctor;
import ro.nca.data.model.Patient;
import ro.nca.data.repositories.DoctorRepo;

import static ro.nca.WebSocketConfiguration.MESSAGE_PREFIX;

/**
 * @author Narcis
 */
@Component
@RepositoryEventHandler(Patient.class)
public class PatientEventHandler {
    private final SimpMessagingTemplate websocket;

    private final EntityLinks entityLinks;

    private final DoctorRepo doctorRepo;

    @Autowired
    public PatientEventHandler(SimpMessagingTemplate websocket, EntityLinks entityLinks, DoctorRepo doctorRepo) {
        this.websocket = websocket;
        this.entityLinks = entityLinks;
        this.doctorRepo = doctorRepo;
    }

    @HandleBeforeCreate
    public void setDoctor(Patient patient) {
        Doctor doctor = this.doctorRepo.findByName(SecurityContextHolder.getContext().getAuthentication().getName());
        patient.setDoctor(doctor);
    }

    @HandleAfterCreate
    public void sendNewPatientNotification(Patient patient) {
        this.websocket.convertAndSend(
                MESSAGE_PREFIX + "/newPatient", getPath(patient));
    }

    @HandleAfterDelete
    public void deletePatient(Patient patient) {
        this.websocket.convertAndSend(
                MESSAGE_PREFIX + "/deletePatient", getPath(patient));
    }

    @HandleAfterSave
    public void updatePatient(Patient patient) {
        this.websocket.convertAndSend(
                MESSAGE_PREFIX + "/updatePatient", getPath(patient));
    }

    /**
     * Take an {@link Patient} and get the URI using Spring Data REST's {@link EntityLinks}.
     *
     * @param patient
     */
    private String getPath(Patient patient) {
        return this.entityLinks.linkForSingleResource(patient.getClass(),
                patient.getId()).toUri().getPath();
    }

}
