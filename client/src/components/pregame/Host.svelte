<script lang="ts">
  import type { CreateRoomResponse } from "../../../../shared/socket";
  import type { Error as _error } from "../../../../shared/types";
  import SocketStore from "../../stores/socketStore";

  let name: string;

  const handleClick = () => {
    if (!name) {
      return;
    }
    // Emit socket event to create a new room.
    $SocketStore.socket.emit("createRoom", name, (resp: CreateRoomResponse) => {
      if (resp.Error) {
        console.log(resp.Error.msg);
        alert(resp.Error.msg);
        return;
      }
      if (!resp.RoomCode) {
        console.error("No error but no room code.");
        return;
      }

      // On success, update the name and room code in context.
      SocketStore.setPlayerInfo(name, resp.RoomCode);
    });
  };
</script>

<div class="flex basis-4/12 flex-col items-center">
  <h2 class="my-8 basis-1/2 text-2xl font-bold">Host Game</h2>
  <div class="flex basis-1/2 flex-row">
    <input
      class="placeholder:text-slate- placeholder: placeholder:bold mx-3 rounded p-2 text-slate-800 placeholder:text-sm"
      type="text"
      id="nameInput"
      placeholder="Name"
      autoComplete="off"
      bind:value={name}
    />
    <button
      class="border-felt bg-felt hover:border-cue active:bg-dark-felt rounded border-2 px-2 py-1"
      on:click={handleClick}
    >
      Host
    </button>
  </div>
</div>
