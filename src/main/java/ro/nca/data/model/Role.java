package ro.nca.data.model;

/**
 * @author Narcis
 */
public enum Role {
    DOCTOR;

    public static final String PREFIX = "ROLE";

    @Override
    public String toString() {
        return PREFIX + "_" + name();
    }
}
