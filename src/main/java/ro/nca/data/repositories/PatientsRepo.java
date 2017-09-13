package ro.nca.data.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.security.access.prepost.PreAuthorize;
import ro.nca.data.model.Patient;

/**
 * @author Narcis
 */
@PreAuthorize("hasRole('ROLE_DOCTOR')")
public interface PatientsRepo extends PagingAndSortingRepository<Patient, Long>, JpaSpecificationExecutor {

    @Override
    //patient is being created or, is owned by this doctor
    @PreAuthorize("#patient?.doctor == null or #patient?.doctor?.name == authentication?.name")
    Patient save(@Param("patient") Patient employee);

    @Override
    @PreAuthorize("@pacientsRepo.findOne(#id)?.doctor?.name == authentication?.name")
    void delete(@Param("id") Long id);

    @Override
    @PreAuthorize("#patient?.doctor?.name == authentication?.name")
    void delete(@Param("patient") Patient patient);

    @Override
    Page<Patient> findAll(Pageable pageable);

    @SuppressWarnings("JpaQlInspection")
    @RestResource(path = "nameContains", rel = "nameContains")
    @Query("SELECT p FROM Patient p WHERE LOWER(p.lastName) like CONCAT('%', CONCAT(LOWER(:name),'%')) OR LOWER(p.firstName) like CONCAT('%', CONCAT(LOWER(:name),'%'))")
    Page<Patient> searchByNameContaining(@Param("name") String name, Pageable p);
}
