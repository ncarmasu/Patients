package ro.nca.data.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;

import javax.persistence.*;
import java.io.Serializable;
import java.time.Instant;

/**
 * @author Narcis on 8/30/2017.
 */
@Data
@MappedSuperclass
public class BaseEntity implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @CreatedDate
    private Instant createTime = Instant.now();

    private
    @Version
    @JsonIgnore
    Long version;

    @JsonIgnore
    public boolean isNew() {
        return this.id == null;
    }

}