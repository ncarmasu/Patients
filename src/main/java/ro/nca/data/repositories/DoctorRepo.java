package ro.nca.data.repositories;

import org.springframework.data.repository.Repository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import ro.nca.data.model.Doctor;

/**
 * @author Narcis
 */
@RepositoryRestResource(exported = false)
public interface DoctorRepo extends Repository<Doctor, Long> {

    Doctor save(Doctor doctor);

    Doctor findByName(String name);

}
