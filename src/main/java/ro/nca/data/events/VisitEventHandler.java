package ro.nca.data.events;

import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.core.annotation.HandleAfterDelete;
import org.springframework.data.rest.core.annotation.HandleBeforeCreate;
import org.springframework.data.rest.core.annotation.HandleBeforeDelete;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;
import org.springframework.hateoas.EntityLinks;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import ro.nca.data.model.Doctor;
import ro.nca.data.model.Patient;
import ro.nca.data.model.Visit;
import ro.nca.data.repositories.DoctorRepo;

import static ro.nca.WebSocketConfiguration.MESSAGE_PREFIX;

@Component
@RepositoryEventHandler(Visit.class)
@Log
public class VisitEventHandler {

    private final DoctorRepo doctorRepo;
    private final EntityLinks entityLinks;
    private final SimpMessagingTemplate websocket;

    @Autowired
    public VisitEventHandler(DoctorRepo doctorRepo, EntityLinks entityLinks, SimpMessagingTemplate websocket) {
        this.doctorRepo = doctorRepo;
        this.entityLinks = entityLinks;
        this.websocket = websocket;
    }

    @HandleBeforeCreate
    public void setDoctor(Visit visit) {
        Doctor doctor = this.doctorRepo.findByName(SecurityContextHolder.getContext().getAuthentication().getName());
        visit.setDoctor(doctor);
    }

    @HandleBeforeDelete
    public void beforeDelete(Visit visit) {
        visit.getPatient().getVisits().remove(visit);
    }

    @HandleAfterDelete
    public void afterDelete(Visit visit) {
        this.websocket.convertAndSend(
                MESSAGE_PREFIX + "/deleteVisit", getPath(visit));
    }

    /**
     * Take an {@link Patient} and get the URI using Spring Data REST's {@link EntityLinks}.
     *
     * @param visit
     */
    private String getPath(Visit visit) {
        return this.entityLinks.linkForSingleResource(visit.getClass(),
                visit.getId()).toUri().getPath();
    }
}
