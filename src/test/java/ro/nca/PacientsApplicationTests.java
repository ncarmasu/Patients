package ro.nca;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

import static org.junit.Assert.assertEquals;

@RunWith(SpringRunner.class)
@SpringBootTest
public class PacientsApplicationTests {

    @Test
    public void contextLoads() {
    }

    @Test
    public void testStuff() {
        Instant instant = Instant.now();
        Instant instant1 = LocalDateTime.ofInstant(instant, ZoneId.systemDefault()).atZone(ZoneId.systemDefault()).toInstant();
        System.out.println("ZoneId.systemDefault() = " + ZoneId.systemDefault());
        assertEquals(instant, instant1);
    }

}
