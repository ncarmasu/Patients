package ro.nca;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import ro.nca.data.model.Doctor;
import ro.nca.data.repositories.DoctorRepo;

/**
 * @author Narcis
 */
@Component
public class UserService implements UserDetailsService {

    private final DoctorRepo repository;

    @Autowired
    public UserService(DoctorRepo repository) {
        this.repository = repository;
    }

    @Override
    public UserDetails loadUserByUsername(String name) throws UsernameNotFoundException {
        Doctor doctor = this.repository.findByName(name);
        return new User(doctor.getName(), doctor.getPassword(),
                AuthorityUtils.createAuthorityList(doctor.getRolesAsString()));
    }

}