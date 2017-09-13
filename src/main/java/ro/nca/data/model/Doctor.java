package ro.nca.data.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.ToString;

import javax.persistence.*;

import static ro.nca.SecurityConfiguration.PASSWORD_ENCODER;

/**
 * @author Narcis
 */
@Data
@ToString(exclude = "password")
@Entity
public class Doctor {
    @Id
    @GeneratedValue
    private Long id;

    private String name;

    @JsonIgnore
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    public Doctor() {
        this.role = Role.DOCTOR;
    }

    public Doctor(String name, String password) {

        this.name = name;
        this.setPassword(password);
        this.role = Role.DOCTOR;
    }

    public void setPassword(String password) {
        this.password = PASSWORD_ENCODER.encode(password);
    }

    public String[] getRolesAsString() {
        return new String[]{role.toString()};
    }
}
