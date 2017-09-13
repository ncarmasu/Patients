package ro.nca.data.repositories;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import ro.nca.data.model.Visit;

@PreAuthorize("hasRole('ROLE_DOCTOR')")
public interface VisitsRepo extends PagingAndSortingRepository<Visit, Long>, JpaSpecificationExecutor {

}
